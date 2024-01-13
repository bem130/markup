var NMLtool = (function () {
    function NMLtool(filename) {
        this.filename = filename;
        {
            if (typeof require != "undefined") {
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
    }
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
    NMLtool.prototype.parseLine = function () {
        var i = 0;
        var IndentSpace = 4;
        var maxIndent = 0;
        var nowIndent = 0;
        while (i < this.code.length) {
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
    };
    NMLtool.prototype.tokenizer = function () {
        var state = 1;
        this.tokenizerstates = ["start", "LF", "comment.LF", "blank", "split", "special", "lassign_", "string.start", "string.end"];
        switch (state) {
        }
    };
    return NMLtool;
}());
