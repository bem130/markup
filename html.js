class NMUc {
    constructor (text="") {
        this.text = text;
        this.parse = this.P_parse(text);
        console.log(this.parse);
    }
    P_parse(text) {
        let t = text;
        console.log(t,"t")
        let i = 0;
        let ret = [];
        let tag = "";
        let att = "";
        let eatt = "";
        let child = "";
        let tfflag = false;
        let searchop = text.indexOf("<");
        if (searchop==-1) {
            return [{tag:"text",att:"",child:text}];
        }
        while (t.length>i) {
            let searchop = text.slice(i).indexOf("<");
            if (searchop==-1) {
                return ret;
            }
            else {
                tfflag = true;
                i+=searchop+1;
                while (!(t[i]==">"||t[i]==" ")&&t.length>i) {
                    tag += t[i];
                    i++;
                }
                if (t[i]==" ") {i++;}
                while (t[i]!=">"&&t.length>i) {
                    att += t[i];
                    i++;
                }
                i++;
                let j = t.length-searchop;
                while (j>i) {
                    if (t[j]=="/") {
                        break;
                    }
                    j--;
                }
                child = t.slice(i-searchop,j-1);
                // console.log(j,i,searchop,i-searchop)
                i = j+2;
                // i+=2;
                // while (!(t[i]==">")&&t.length>i) {
                //     eatt += t[i];
                //     i++;
                // }
                console.log(child,"child");
                //child = this.P_parse(child);
                if (["script","style"].indexOf(tag)==-1&&tag!="") {
                    ret.push({tag:tag,att:att,child:child})
                }
                tag = "";
                att = "";
                eatt = "";
                child = "";
            }
            i++;
        }
        if (tfflag) {return ret;}
        else {return [{tag:"text",att:"",child:text}];}
    }
    getTXT() {
        this.outtxt = ""
        this._gettxt(this.parse);
        return this.outtxt;
    }
    _gettxt(data) {
        for (let tag of data) {
            if (tag.tag=="text") {
                this.outtxt += tag.child;
                return tag.child;
            }
            else {
                if (["title","h1","h2","h3","h4","h5","h6","h7","div","p"].indexOf(tag.tag)!=-1) {
                    this.outtxt+="\n";
                }
                this._gettxt(tag.child);
            }
        }
        return "";
    }
}