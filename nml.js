var NMLtool = /** @class */ (function () {
    function NMLtool(filename) {
        this.filename = filename;
        { // Define the fRead function
            // @ts-ignore
            if (typeof require != "undefined") {
                // @ts-ignore
                var fs_1 = require('fs');
                this.fRead = function (filename) {
                    return fs_1.readFileSync(filename, 'utf8').replace(/\r\n/g, "\n");
                };
            }
            else {
                this.fRead = function (filename) {
                    var hr = new XMLHttpRequest();
                    hr.open("GET", filename, false);
                    hr.send(null);
                    if (hr.status == 200 || hr.status == 304) {
                        return hr.responseText.replace(/\r\n/g, "\n");
                    }
                    else {
                        throw "err " + filename;
                    }
                };
            }
        }
        this.code = this.fRead(filename);
        //console.log(this.code)
    }
    NMLtool.prototype.tokenizeerror = function (message, i) {
        // @ts-ignore
        var error = new Error(message, this.filename);
        error.name = "NML_TokenizeError";
        var LineAndCol = this.getLineAndCol(i);
        // @ts-ignore
        error.lineNumber = LineAndCol.line;
        error.columnNumber = LineAndCol.col;
        //error.stack = ""
        return error;
    };
    NMLtool.prototype.getLineAndCol = function (i) {
        var j = 0;
        var line = 1;
        var col = 1;
        while (j < i) {
            if (this.code[j] == "\n") {
                line++;
                col = 0;
            }
            else {
                col++;
            }
            j++;
        }
        return { line: line, col: col };
    };
    NMLtool.prototype.parse = function () {
        var tar = [];
        this.tokenarr = tar;
        var state = 0;
        var i = 0;
        var tc = this.code;
        //console.log(tar)
        this.tokengroup = {
            "start": "null",
            "LF": "LF",
            "comment.LF": "LF",
            "split": "split",
            "string.space": "string",
            "lassign": "assign",
            "rassign": "assign",
            "special": "special",
            "comment.start": "comment",
            "string.start": "string",
            "token": "token",
            "comment.notestart": "comment",
            "comment.blockstart": "comment",
            "comment.linecomment": "comment",
            "comment.notebeforeblank": "comment",
            "comment.note": "comment",
            "comment.blockend": "comment",
            "comment.blockcomment": "comment",
            "string.escape1": "string",
            "string.end": "string",
            "string.char": "string",
            "string.escape2": "string",
            "lassign_": "assign",
            "rassign_": "assign",
        };
        this.tokenizerstates = ["start", "LF", "comment.LF", "split", "string.space", "lassign", "rassign", "special", "comment.start", "string.start", "token", "comment.notestart", "comment.blockstart", "comment.linecomment", "comment.notebeforeblank", "comment.note", "comment.blockend", "comment.blockcomment", "string.escape1", "string.end", "string.char", "string.escape2", "lassign_", "rassign_"];
        var sts = this.tokenizerstates;
        while (i < this.code.length) {
            switch(state){
                case 1:
                    if ((tc[i]=="#")&&(tc[i+1]=="#")) state=3;
                    else state=0;
                    break;
                case 3:
                    state=4;
                    break;
                case 4:
                    if ((tc[i]==" ")) state=5;
                    else if ((tc[i]=="\n")) state=6;
                    else state=7;
                    break;
                case 5:
                    if ((tc[i]==" ")) state=5;
                    else if ((tc[i]=="\n")) state=6;
                    else state=7;
                    break;
                case 7:
                    if ((tc[i]=="\n")) state=6;
                    else state=7;
                    break;
                case 6:
                    state=0;
            }
            if (state != 1) {
                var LineAndCol = this.getLineAndCol(i);
                //console.log(i,this.code[i].replace(/\n/g,"\\n"),sts[state],state)
                if (tar.length == 0 || state != tar[tar.length - 1].type || state == 1 || state == 2 || state == 3) {
                    // @ts-ignore
                    tar.push({ type: state, type_str: sts[state], val: this.code[i], i: i, line: LineAndCol.line, col: LineAndCol.col, group: this.tokengroup[sts[state]] });
                }
                else {
                    tar[tar.length - 1].val += this.code[i];
                }
                if (state==0) {
                    throw JSON.stringify(tar[tar.length-1])
                }
                //console.table(tar)
                i++;
            }
        }
        console.table(tar);
        return this;
    };
    return NMLtool;
}());
// @ts-ignore
if ((typeof require != "undefined")) {
    var code_res = new NMLtool("./test4.nml").tokenize();
    // @ts-ignore
    code_res.parse();
}
