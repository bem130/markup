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
            if (t[i-1]!="\\"&&(t[i]=="#"||(t[i]=="{"&&t[i+1]=="{"))) { // structure
                if (nstxt.length>0) {
                    let child = this.P_block(nstxt);
                    for (let chd of child) {
                        ret.push(chd);
                    }
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
                else if (t[i]=="{"&&t[i+1]=="{") { // block
                    i+=2;
                    let type = "";
                    while (t[i]!="\n"&&t.length>i) {
                        type += t[i];
                        i++;
                    }
                    i++;
                    let content = "";
                    while (t.length>i) {
                        if (t[i]=="\n"&&t[i+1]=="}"&&t[i+2]=="}") {i+=3;break;}
                        i++;
                        content += t[i-1];
                        if (t[i]=="\n"&&t[i+1]=="\\"&&t[i+2]=="}"&&t[i+3]=="}") {
                            i+=2;
                            content += "\n";
                        }
                    }
                    if (type.startsWith("embed:")) {
                        ret.push({type:"embed",text:type.slice(6),content:content});
                    }
                    else if (type.startsWith("code:")) {
                        ret.push({type:"cblock",text:type.slice(5),content:content});
                    }
                }
            }
            else {
                i++;
                if (t[i-1]=="\\"&&(t[i]=="#"||(t[i]=="{"&&t[i+1]=="{"))) {
                    i++;
                }
                i--;
                if (!(t[i]=="#"||(t[i]=="{"&&t[i+1]=="{"))) {
                    nstxt+=t[i];
                }
                i++;
            }
        }
        if (nstxt.length>0) {
            let child = this.P_block(nstxt);
            for (let chd of child) {
                ret.push(chd);
            }
            nstxt = "";
        }
        return ret;
    }
    P_block(block) {
        if (block[0]=="\n") {
            block = block.slice(1);
        }
        if (block[block.length-1]=="\n") {
            block = block.slice(0,block.length-1);
        }
        let i = 0;
        let t = block;
        let nstxt = "";
        let cblk = [];
        let tag = "";
        while (t.length>i) {
            if ((t[i]=="{")) { // structure
                if (nstxt.length>0) {
                    cblk.push({type:"text",child:[nstxt]});
                    nstxt = "";
                }
                i++;
                while (t.length>i) {
                    if (t[i]==":") {
                        console.log(tag)
                        break;
                    }
                    tag+=t[i];
                    i++;
                }
                let child = [];
                let ctxt = "";
                i++;
                while (t.length>i) {
                    if (t[i]=="}") {
                        child.push(ctxt);
                        cblk.push({type:tag,child:child})
                        break;
                    }
                    else if (t[i]==";") {
                        child.push(ctxt);
                        i++;
                        ctxt = "";
                    }
                    ctxt+=t[i];
                    i++;
                }
            }
            else {
                nstxt+=t[i];
            }
            tag = "";
            i++;
        }
        if (nstxt.length>0) {
            cblk.push({type:"text",child:[nstxt]});
            nstxt = "";
        }
        console.log(cblk)
        return cblk;
    }
    getTXT() {
        let ret = "";
        let t = this.parse;
        for (let cnt=0;cnt<t.length;cnt++) {
            switch (t[cnt].type) {
                case "text":
                    ret += t[cnt].child[0];
                break;
                case "alias":
                    ret += t[cnt].child[0];
                break;
                case "url":
                    ret += t[cnt].child[0];
                break;
                case "inline":
                    ret += t[cnt].child[0];
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
                case "text":
                    telm = document.createElement("span");
                    telm.innerText = t[cnt].child[0];
                    ret.appendChild(telm);
                break;
                case "alias":
                    telm = document.createElement("span");
                    telm.innerText = t[cnt].child[0];
                    telm.title = t[cnt].child.join(",");
                    ret.appendChild(telm);
                break;
                case "url":
                    telm = document.createElement("a");
                    telm.innerText = t[cnt].child[0];
                    telm.href = t[cnt].child[0];
                    ret.appendChild(telm);
                break;
                case "inline":
                    telm = document.createElement("code");
                    telm.innerText = t[cnt].text;
                    ret.appendChild(telm);
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
                    telm.classList.add(t[cnt].text)
                    tpelm.appendChild(telm);
                    ret.appendChild(tpelm);
                break;
                case "embed":
                    tpelm = document.createElement("pre");
                    telm = document.createElement("code");
                    telm.innerText += t[cnt].content;
                    telm.classList.add(t[cnt].text)
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