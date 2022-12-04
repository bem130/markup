class NMUc {
    constructor (text="") {
        this.text = text;
        let tags = this.P_read(text);
        let pars = this.P_parse(tags);
        console.log(pars);
    }
    P_parse(ret) {
        console.log(ret)
        let strc = [];
        let i = 0;
        let child = [];
        let tflag = false;
        while (i<ret.length) {
            console.log(0)
            if (ret[i].type=="open") {
                let ocnt = 0;
                let tagname = ret[i].text;
                let schild = i;
                i++;
                if (ret[i].type=="open") {
                    i++;
                    ocnt++;
                }
                else if (ret[i].type=="close") {
                    if (ocnt==0) {
                        i++;
                        console.log(schild,i)
                        strc.push({tag:tagname,child:ret.slice(0,10)});
                        continue;
                    }
                    else {
                        i++;
                        ocnt--;
                    }
                }
                else {
                    child.push(ret[i]);
                    i++;
                }
            }
            i++;
        }
        return strc;
    }
    P_read(text) {
        let t = text;
        let i = 0;
        let ret = [];
        let tag = "";
        while (t.length>i) {
            if (t[i]=="<"&&t[i+1]!="/") {
                if (tag.length>0) {
                    ret.push({type:"text",text:tag});
                    tag = "";
                }
                while (t.length>i) {
                    if (t[i]==">") {
                        tag += t[i];
                        ret.push({type:"open",text:tag});
                        tag = "";
                        i++;
                        break;
                    }
                    tag += t[i];
                    i++;
                }
            }
            else if (t[i]=="<"&&t[i+1]=="/") {
                if (tag.length>0) {
                    ret.push({type:"text",text:tag});
                    tag = "";
                }
                while (t.length>i) {
                    if (t[i]==">") {
                        tag += t[i];
                        ret.push({type:"close",text:tag});
                        tag = "";
                        i++;
                        break;
                    }
                    tag += t[i];
                    i++;
                }
            }
            else {
                tag+=t[i];
                i++;
            }
        }
        return ret;
    }
}

function start(data) {
    console.log("")
    console.log(data);
    console.log("----------------------------------------------");
    let rt = new NMUc(data);
}
start(`<html><meta charset="utf-8">abv</html>`);