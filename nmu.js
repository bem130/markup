class NMUc {
    constructor (text="") {
        this.text = text;
    }
    P_parse(text) {
        let t = text;
        let i = 0;
        let ret = [];
        let nstxt = "";
        while (t.length>i) {
            if (t[i]=="#"||(t[i]=="`"&&t[i+1]=="`"&&t[i+2]=="`")) { // structure
                if (nstxt.length>0) {
                    ret.push({type:"body",child:this.P_block(nstxt)});
                    nstxt = "";
                }
                if (t[i]=="#") { // title
                    let size = -1;
                    i++;
                    if (t[i]==" ") {i++;}
                    else {
                        size = ["1","2","3","4"].indexOf(t[i])+1;
                        i++;
                        if (t[i]==" ") {i++;}
                    }
                    let content = "";
                    while (t[i]!="\n"&&t.length>i) {
                        content += t[i];
                        i++;
                    }
                    if (size==-1) {
                        ret.push({type:"dtitle",text:content});
                    }
                    else {
                        ret.push({type:"title",size:size,text:content});
                    }
                }
                else if (t[i]=="`"&&t[i+1]=="`"&&t[i+2]=="`") { // block
                    i+=3;
                    let type = "";
                    while (t[i]!="\n"&&t.length>i) {
                        type += t[i];
                        i++;
                    }
                    i++;
                    let content = "";
                    while (t.length>i) {
                        if ((t[i]=="\n"&&t[i+1]=="`"&&t[i+2]=="`"&&t[i+3]=="`")) {i+=4;break;}
                        content += t[i];
                        i++;
                    }
                    if (type.startsWith("embed-")) {
                        ret.push({type:"embed",btype:type.slice(6),content:content});
                    }
                    else {
                        ret.push({type:"cblock",btype:type,content:content});
                    }
                }
            }
            else {
                nstxt+=t[i];
            }
            i++;
        }
        if (nstxt.length>0) {
            ret.push({type:"body",child:this.P_block(nstxt)});
            nstxt = "";
        }
        return ret;
    }
    P_block(block) {
        // console.log("child--")
        // console.log(block)
        let i = 0;
        let t = block;
        let nstxt = "";
        let cblk = [];
        while (t.length>i) {
            if (t[i]=="["||t[i]=="`"||(t[i]=="("&&t[i+1]==":")) { // structure
                if (nstxt.length>0) {
                    cblk.push({type:"text",text:nstxt});
                    nstxt = "";
                }
                if (t[i]=="[") { // link
                    let t1 = "";
                    let t2 = "";
                    i++;
                    while (t[i]!="]"&&t.length>i) {
                        t1 += t[i];
                        i++;
                    }
                    i++;
                    if (t[i]!="(") {i--;cblk.push({type:"link",text:t1,ref:t1})}
                    else {
                        i++;
                        while (t[i]!=")"&&t.length>i) {
                            t2 += t[i];
                            i++;
                        }
                        i++;
                        cblk.push({type:"link",text:t1,ref:t2})
                    }
                }
                if (t[i]=="`") { // link
                    let t1 = "";
                    i++;
                    while (t[i]!="`"&&t.length>i) {
                        t1 += t[i];
                        i++;
                    }
                    cblk.push({type:"inline",text:t1})
                }
                if (t[i]=="("&&t[i+1]==":") { // alias
                    i+=2;
                    let names = [];
                    let t1 = "";
                    while (t[i]!=")"&&t.length>i) {
                        if (t[i]==",") {
                            names.push(t1);
                            t1 = "";
                        }
                        else {
                            t1 += t[i];
                        }
                        i++;
                    }
                    if (t[i-1]!=",") {
                        names.push(t1);
                    }
                    cblk.push({type:"alias",text:names[0],alias:names})
                }
            }
            else {
                nstxt+=t[i];
            }
            i++;
        }
        if (nstxt.length>0) {
            cblk.push({type:"text",text:nstxt});
            nstxt = "";
        }
        console.log(cblk)
        return cblk;
    }
    getHTML() {
    }
}


// test
let rt = new NMUc("# Hello World\ntext\ntext\n\ntext[https://example.com/]a(:aiu,AIU,あいう))[hello](https://example.com)`hello`\n\n#1 txt-codeblock\n```txt\nhello\n```\n\n#2txt-embed\n```embed-txt\nhello\n```");
console.log(rt.text);
console.log("---- ----");
console.log(rt.P_parse(rt.text));