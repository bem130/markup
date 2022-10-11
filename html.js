class NMUc {
    constructor (text="") {
        this.text = text;
        this.parse = this.P_parse(text);
        console.log(this.parse);
    }
    P_parse(text) {
        let t = text;
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
            searchop = text.indexOf("<");
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
                let ocnt = 0;
                if (text.slice(i)[1]=="/") {
                    console.log("aaa")
                }
                console.log(text.slice(i))
                console.log(i,searchop,text.slice(i))
                // while (t.length>i) {

                //     if (t[i]=="<") {
                //         if (t[i+1]=="/") {
                //             if (ocnt==0) {i++;break;}
                //             child += "<";
                //             i++;
                //             ocnt--;
                //         }
                //         else {
                //             ocnt++;
                //         }
                //     }
                //     child += t[i];
                //     i++;
                // }
                // i+=2;
                // while (!(t[i]==">")&&t.length>i) {
                //     eatt += t[i];
                //     i++;
                // }
                // child = this.P_parse(child);
                // if (["script","style"].indexOf(tag)==-1&&tag!="") {
                //     ret.push({tag:tag,att:att,child:child})
                // }
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