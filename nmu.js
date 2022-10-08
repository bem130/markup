class NMUc {
    constructor (text="") {
        this.text = text;
        this.parse = this.P_parse(text);
    }
    P_parse(text) {
        let t = text;
        let i = 0;
        let ret = [];
        let nstxt = "";
        while (t.length>i) {
            if (t[i-1]!="\\"&&(t[i]=="#"||(t[i]=="`"&&t[i+1]=="`"&&t[i+2]=="`"))) { // structure
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
                        if (t[i]=="\n"&&t[i+1]=="`"&&t[i+2]=="`"&&t[i+3]=="`") {i+=4;break;}
                        i++;
                        content += t[i-1];
                        if (t[i]=="\n"&&t[i+1]=="\\"&&t[i+2]=="`"&&t[i+3]=="`"&&t[i+4]=="`") {
                            i+=3;
                            content += "\n";
                        }
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
                i++;
                if (t[i-1]=="\\"&&(t[i]=="#"||(t[i]=="`"&&t[i+1]=="`"&&t[i+2]=="`"))) {
                    i++;
                }
                i--;
                if (!(t[i]=="#"||(t[i]=="`"&&t[i+1]=="`"&&t[i+2]=="`"))) {
                    nstxt+=t[i];
                }
                i++;
            }
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
                    i++;
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
        return cblk;
    }
    getTXT() {
        let ret = "";
        let t = this.parse;
        for (let cnt=0;cnt<t.length;cnt++) {
            switch (t[cnt].type) {
                case "body":
                    for (let cbt=0;cbt<t[cnt].child.length;cbt++) {
                        let bcc = t[cnt].child[cbt];
                        switch (bcc.type) {
                            case "text":
                                ret += bcc.text;
                            break;
                            case "alias":
                                ret += bcc.text;
                            break;
                            case "link":
                                ret += bcc.text;
                            break;
                            case "inline":
                                ret += bcc.text;
                            break;
                        }
                    }
                break;
                case "dtitle":
                    ret += "*** ";
                    ret += t[cnt].text;
                    ret += " ***\n";
                break;
                case "title":
                    let st = "";
                    let sp = "";
                    for (let i=0;i<t[cnt].size-1;i++) {
                        sp+=" ";
                    }
                    for (let i=5;i>=t[cnt].size;i--) {
                        st+="-";
                    }
                    ret += sp;
                    ret += st;
                    ret += " ";
                    ret += t[cnt].text;
                    ret += "\n";
                break;
                case "cblock":
                    ret += t[cnt].content;
                break;
                case "embed":
                    ret += t[cnt].content;
                break;
            }
        }
        return ret;
    }
    getHTML() {
        let ret = document.createElement("div");
        let t = this.parse;
        let telm;
        let tpelm;
        for (let cnt=0;cnt<t.length;cnt++) {
            switch (t[cnt].type) {
                case "body":
                    for (let cbt=0;cbt<t[cnt].child.length;cbt++) {
                        let bcc = t[cnt].child[cbt];
                        switch (bcc.type) {
                            case "text":
                                telm = document.createElement("span");
                                telm.innerText = bcc.text;
                                ret.appendChild(telm);
                            break;
                            case "alias":
                                telm = document.createElement("span");
                                telm.innerText = bcc.text;
                                telm.title = bcc.alias.join(",");
                                ret.appendChild(telm);
                            break;
                            case "link":
                                telm = document.createElement("a");
                                telm.innerText = bcc.text;
                                telm.href = bcc.ref;
                                ret.appendChild(telm);
                            break;
                            case "inline":
                                telm = document.createElement("code");
                                telm.innerText = bcc.text;
                                ret.appendChild(telm);
                            break;
                        }
                    }
                break;
                case "dtitle":
                    telm = document.createElement("h1");
                    telm.innerText += t[cnt].text;
                    ret.appendChild(telm);
                break;
                case "title":
                    telm = document.createElement("h"+(1+t[cnt].size));
                    telm.innerText += t[cnt].text;
                    ret.appendChild(telm);
                break;
                case "cblock":
                    tpelm = document.createElement("pre");
                    telm = document.createElement("code");
                    telm.innerText += t[cnt].content;
                    tpelm.appendChild(telm);
                    ret.appendChild(tpelm);
                break;
                case "embed":
                    tpelm = document.createElement("pre");
                    telm = document.createElement("code");
                    telm.innerText += t[cnt].content;
                    tpelm.appendChild(telm);
                    ret.appendChild(tpelm);
                break;
            }
        }
        console.log(ret)
        return ret;
    }
}
class NMUembed {
    constructor (type="") {
    }
}