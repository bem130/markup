
interface NML_Line {
    text: string,
    indent: number,
    ltype: "title"|"block"|"normal",
}
class NMLtool {
    private code:string;
    private filename:string;
    private fRead:Function;
    linearr:Array<NML_Line>;
    tokenizerstates:Array<string>;
    constructor(filename: string) {
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
        return {line:line,col:col};
    }
    parseLine(): Array<NML_Line> {
        let i:number = 0;
        let IndentSpace = 4;
        let maxIndent:number = 0;
        let nowIndent:number = 0;
        while (i<this.code.length) {
            switch (this.code[i]) {
                case "#":
                break;
                case "@":
                break;
                case "\n":
                break;
                case " ":
                break;
                default:
                break;
            }
        }
        return this.linearr;
    }
    tokenizer() {
        let state = 1;
        /*TokenizerReplace_states_start*/
        this.tokenizerstates = ["start","LF","comment.LF","blank","split","special","lassign_","string.start","string.end"]
        /*TokenizerReplace_states_end*/
        /*TokenizerReplace_switch_start*/
            switch(state){
            }
            /*TokenizerReplace_switch_end*/
    }
}