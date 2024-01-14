type span = [number,number];
interface NML_document {
    type: "document",
    span: span,
    documenttitle: NML_documenttitle|null,
    nodes: Array<object>|null,
}
interface NML_nmlnode {
    type: "nmlnode",
    span: span,
    nodetitle: NML_nodetitle,
    nodes: NML_nodes,
}
type NML_nodes = Array<NML_node>
type NML_node = NML_nmlnode|NML_block|NML_paragraph
interface NML_paragraph {
    type: "paragraph",
    span: span,
    contents: Array<NML_contents>
}
interface NML_contents {
    type: "contents",
    span: span,
    contents: Array<NML_text|NML_inline>,
}
interface NML_block {
    type: "block",
    span: span,
    embtype: NML_embtype,
    code: NML_code,
}
interface NML_inline {
    type: "inline",
    span: span,
    embtype: NML_embtype,
    code: NML_code,
}
interface NML_code {
    type: "code",
    span: span,
    text: string,
}
interface NML_documenttitle {
    type: "documenttitle",
    span: span,
    text: string,
}
interface NML_nodetitle {
    type: "nodetitle",
    span: span,
    text: string,
}
interface NML_text {
    type: "text",
    span: span,
    text: string,
}
interface NML_embtype {
    type: "embtype",
    span: span,
    module: string,
    args: Array<Record<string,string>>,
}



class NMLtool {
    private code:string;
    private filename:string;
    private fRead:Function;
    tokenizerstates:Array<string>;
    indentSpace:number;
    constructor(filename: string) {
        this.indentSpace = 4; // インデントのスペースの個数
        this.filename = filename;
        { // Define the fRead function
            // @ts-ignore
            if (typeof require!="undefined") {
                // @ts-ignore
                const fs:any = require('fs');
                this.fRead = function (filename): string {
                    return fs.readFileSync(filename,'utf8').replace(/\r\n/g,"\n");
                }
            }
            else {
                this.fRead = function (filename): string {
                    let hr:any = new XMLHttpRequest()
                    hr.open("GET",filename,false);
                    hr.send(null);
                    if (hr.status==200||hr.status==304) {
                        return hr.responseText.replace(/\r\n/g,"\n");
                    }
                    else {
                        throw "err "+filename;
                    }
                }
            }
        }
        this.code = this.fRead(filename);
        //console.log(this.code)
    }
    getLineAndCol(i:number): object {
        let j:number = 0;
        let line:number = 1;
        let col:number = 1;
        while (j<i) {
            if (this.code[j]=="\n") {
                line++;
                col = 0;
            }
            else {
                col++;
            }
            j++;
        }
        return [line,col];
    }

    parseTree_document():NML_document {
        console.log(this.code)
        let i:number = 0;
        let maxIndent:number = 0;
        let parseTree:NML_document ={ type:"document",span:[i,this.code.length],documenttitle:null,nodes:null };
        if (this.code[0]=="#") {
            if (this.code[1]!=" ") { throw `error ${this.getLineAndCol(i).toString()}: タイトルの\"#\"の後ろには空白が必要です` }
            i = 2;
            let doctitle_text = "";
            let nodes_text = "";
            // @ts-ignore
            let doctitle_span:span = [i,null];
            // @ts-ignore
            let nodes_span:span = [null,this.code.length];
            while (true) {
                if (i==this.code.length) {throw `error ${this.getLineAndCol(i).toString()}: ドキュメントの内容がありません`}
                if (this.code[i]!="\n") {
                    doctitle_text+=this.code[i];
                    i++;
                    doctitle_span[1] = i;
                }
                else { i++;break; }
            }
            nodes_span[0] = i;
            while (i<this.code.length) {
                nodes_text+=this.code[i];
                i++;
            }
            parseTree.documenttitle = this.parseTree_documenttitle(doctitle_span);
            parseTree.nodes = this.parseTree_nodes(nodes_span,0);
        }
        else {
            throw `error ${this.getLineAndCol(i).toString()}: ドキュメントのタイトルがありません`;
        }
        console.log(parseTree)
        return parseTree;
    }
    parseTree_checkIndent(i:number) {
        let flag = true;
        for (let j:number=0;j<this.indentSpace;j++) {
            if (this.code[i+j]!=" ") { flag=false;break; }
        }
        return flag;
    }
    parseTree_nodes(nodes_span:span,indent:number):NML_nodes {
        let nodes:NML_nodes = [];
        let i:number = nodes_span[0];
        let indentstat:boolean = false; // インデントを受け付けるか (nmlnodeとblockの時は受け付ける)
        let lineinfo:Array<["indents"|"nmlnode"|"block"|"empty"|"contents"|"eos",number]> = [];
        while (i<nodes_span[1]) {
            if (this.code[i-1]=="\n") { // 行頭
                if (indentstat&&this.parseTree_checkIndent(i+indent*this.indentSpace)) { // インデント有り
                    lineinfo.push(["indents",i]);
                }
                else { // インデント無し
                    indentstat = false;
                    if (this.code[i+indent*this.indentSpace]=="#") { // タイトル -> nmlnode
                        indentstat = true;
                        lineinfo.push(["nmlnode",i]);
                    }
                    else if (this.code[i+indent*this.indentSpace]=="&") { // ブロック -> block
                        indentstat = true;
                        lineinfo.push(["block",i]);
                    }
                    else if (this.code[i+indent*this.indentSpace]=="\n") { // 空行
                        lineinfo.push(["empty",i]);
                    }
                    else { // 本文 -> content
                        lineinfo.push(["contents",i]);
                    }
                }
            }
            i++;
        }
        lineinfo.push(["eos",i+1]);
        console.log(lineinfo)
        let j:number = 0;
        while (j<lineinfo.length) {
            if (lineinfo[j][0]=="nmlnode") {
                let k:number = j+1;
                if (lineinfo[k][0]=="indents") {
                    while (lineinfo[k][0]=="indents") {k++;}
                    nodes.push(this.parseTree_nmlnode([lineinfo[j][1],lineinfo[j+1][1]-1],[lineinfo[j+1][1],lineinfo[k][1]-1],indent));
                    j = k-1;
                }
                else {
                    throw `error ${this.getLineAndCol(i).toString()}: タイトル以下の内容がありません`
                }
            }
            if (lineinfo[j][0]=="block") {
                let k:number = j+1;
                if (lineinfo[k][0]=="indents") {
                    while (lineinfo[k][0]=="indents") {k++;}
                    nodes.push(this.parseTree_block([lineinfo[j][1],lineinfo[j+1][1]-1],[lineinfo[j+1][1],lineinfo[k][1]-1],indent));
                    j = k-1;
                }
                else {
                    throw `error ${this.getLineAndCol(i).toString()}: ブロックのコードがありません`
                }
            }
            if (lineinfo[j][0]=="contents") {
                let paragraph:NML_paragraph = {type:"paragraph",span:[lineinfo[j][1],lineinfo[j+1][1]-1],contents:[]};
                while (lineinfo[j][0]=="contents") {
                    paragraph.contents.push(this.parseTree_content([lineinfo[j][1],lineinfo[j+1][1]-1],indent));
                    paragraph.span[1] = lineinfo[j+1][1]-1;
                    j++;
                }
                j--;
                nodes.push(paragraph);
            }
            j++;
        }
        return nodes
    }
    parseTree_content(content_span:span,indent:number):NML_contents { // inline無し暫定版
        let text:string = "";
        let i:number = content_span[0];
        while (i<content_span[1]) {
            if (this.code[i-1]=="\n") {
                i += indent*this.indentSpace;
            }
            text += this.code[i];
            i++;
        }
        return {
            type: "contents",
            span: content_span,
            text: text,
        }
    }
    parseTree_block(embtype_span:span,code_span:span,indent:number):NML_block {
        return {
            type: "block",
            span: [embtype_span[0],code_span[1]],
            embtype: this.parseTree_embtype(embtype_span),
            code: this.parseTree_code(code_span,indent+1),
        }
    }
    parseTree_nmlnode(nodetitle_span:span,nodes_span:span,indent:number):NML_nmlnode {
        return {
            type: "nmlnode",
            span: [nodetitle_span[0],nodes_span[1]],
            nodetitle: this.parseTree_nodetitle(nodetitle_span),
            nodes: this.parseTree_nodes(nodes_span,indent+1),
        }
    }
    parseTree_inline() {
    }
    parseTree_code(code_span:span,indent:number):NML_code {
        let text:string = "";
        let i:number = code_span[0];
        while (i<code_span[1]) {
            if (this.code[i-1]=="\n") {
                i += indent*this.indentSpace;
            }
            text += this.code[i];
            i++;
        }
        return {
            type: "code",
            span: code_span,
            text: text,
        }
    }
    parseTree_embtype(embtype_span:span) {
    }
    parseTree_documenttitle(doctitle_span:span):NML_documenttitle {
        return {type:"documenttitle",span:doctitle_span,text:this.code.slice(...doctitle_span)}
    }
    parseTree_nodetitle(nodetitle_span:span):NML_nodetitle {
        return {type:"nodetitle",span:nodetitle_span,text:this.code.slice(...nodetitle_span)}
    }
    parseTree_trimIndent() {
    }
}