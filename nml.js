var NMLtool = (function () {
    function NMLtool(filename) {
        this.indentSpace = 4;
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
        return [line, col];
    };
    NMLtool.prototype.parseTree_document = function () {
        console.log(this.code);
        var i = 0;
        var maxIndent = 0;
        this.parseTree = { type: "document", span: [i, this.code.length], documenttitle: null, nodes: null };
        if (this.code[0] == "#") {
            if (this.code[1] != " ") {
                throw "error ".concat(this.getLineAndCol(i).toString(), ": \u30BF\u30A4\u30C8\u30EB\u306E\"#\"\u306E\u5F8C\u308D\u306B\u306F\u7A7A\u767D\u304C\u5FC5\u8981\u3067\u3059");
            }
            i = 2;
            var doctitle_text = "";
            var nodes_text = "";
            var doctitle_span = [i, null];
            var nodes_span = [null, this.code.length];
            while (true) {
                if (i == this.code.length) {
                    throw "error ".concat(this.getLineAndCol(i).toString(), ": \u30C9\u30AD\u30E5\u30E1\u30F3\u30C8\u306E\u5185\u5BB9\u304C\u3042\u308A\u307E\u305B\u3093");
                }
                if (this.code[i] != "\n") {
                    doctitle_text += this.code[i];
                    i++;
                    doctitle_span[1] = i;
                }
                else {
                    i++;
                    break;
                }
            }
            nodes_span[0] = i;
            while (i < this.code.length) {
                nodes_text += this.code[i];
                i++;
            }
            this.parseTree.documenttitle = this.parseTree_documenttitle(doctitle_span);
            this.parseTree.nodes = this.parseTree_nodes(nodes_span, 0);
        }
        else {
            throw "error ".concat(this.getLineAndCol(i).toString(), ": \u30C9\u30AD\u30E5\u30E1\u30F3\u30C8\u306E\u30BF\u30A4\u30C8\u30EB\u304C\u3042\u308A\u307E\u305B\u3093");
        }
        console.log(this.parseTree);
        return this.parseTree;
    };
    NMLtool.prototype.parseTree_checkIndent = function (i) {
        var flag = true;
        for (var j = 0; j < this.indentSpace; j++) {
            if (this.code[i + j] != " ") {
                flag = false;
                break;
            }
        }
        return flag;
    };
    NMLtool.prototype.parseTree_nodes = function (nodes_span, indent) {
        var nodes = [];
        var i = nodes_span[0];
        var indentstat = false;
        var lineinfo = [];
        while (i < nodes_span[1]) {
            if (this.code[i - 1] == "\n") {
                if (indentstat && this.parseTree_checkIndent(i + indent * this.indentSpace)) {
                    lineinfo.push(["indents", i]);
                }
                else {
                    indentstat = false;
                    if (this.code[i + indent * this.indentSpace] == "#") {
                        indentstat = true;
                        lineinfo.push(["nmlnode", i]);
                    }
                    else if (this.code[i + indent * this.indentSpace] == "&") {
                        indentstat = true;
                        lineinfo.push(["block", i]);
                    }
                    else if (this.code[i + indent * this.indentSpace] == "\n") {
                        lineinfo.push(["empty", i]);
                    }
                    else {
                        lineinfo.push(["contents", i]);
                    }
                }
            }
            i++;
        }
        lineinfo.push(["eos", i + 1]);
        console.log(lineinfo);
        var j = 0;
        while (j < lineinfo.length) {
            if (lineinfo[j][0] == "nmlnode") {
                var k = j + 1;
                if (lineinfo[k][0] == "indents") {
                    while (lineinfo[k][0] == "indents") {
                        k++;
                    }
                    nodes.push(this.parseTree_nmlnode([lineinfo[j][1] + indent * this.indentSpace, lineinfo[j + 1][1] - 1], [lineinfo[j + 1][1], lineinfo[k][1] - 1], indent));
                    j = k - 1;
                }
                else {
                    throw "error ".concat(this.getLineAndCol(i).toString(), ": \u30BF\u30A4\u30C8\u30EB\u4EE5\u4E0B\u306E\u5185\u5BB9\u304C\u3042\u308A\u307E\u305B\u3093");
                }
            }
            if (lineinfo[j][0] == "block") {
                var k = j + 1;
                if (lineinfo[k][0] == "indents") {
                    while (lineinfo[k][0] == "indents") {
                        k++;
                    }
                    nodes.push(this.parseTree_block([lineinfo[j][1] + indent * this.indentSpace, lineinfo[j + 1][1] - 1], [lineinfo[j + 1][1], lineinfo[k][1] - 1], indent));
                    j = k - 1;
                }
                else {
                    throw "error ".concat(this.getLineAndCol(i).toString(), ": \u30D6\u30ED\u30C3\u30AF\u306E\u30B3\u30FC\u30C9\u304C\u3042\u308A\u307E\u305B\u3093");
                }
            }
            if (lineinfo[j][0] == "contents") {
                var paragraph = { type: "paragraph", span: [lineinfo[j][1], lineinfo[j + 1][1] - 1], contents: [] };
                while (lineinfo[j][0] == "contents") {
                    paragraph.contents.push(this.parseTree_content([lineinfo[j][1] + indent * this.indentSpace, lineinfo[j + 1][1] - 1], indent));
                    paragraph.span[1] = lineinfo[j + 1][1] - 1;
                    j++;
                }
                j--;
                nodes.push(paragraph);
            }
            j++;
        }
        return nodes;
    };
    NMLtool.prototype.parseTree_content = function (content_span, indent) {
        var text = "";
        var i = content_span[0];
        while (i < content_span[1]) {
            if (this.code[i - 1] == "\n") {
                i += indent * this.indentSpace;
            }
            text += this.code[i];
            i++;
        }
        return {
            type: "contents",
            span: content_span,
            text: text,
        };
    };
    NMLtool.prototype.parseTree_block = function (embtype_span, code_span, indent) {
        return {
            type: "block",
            span: [embtype_span[0], code_span[1]],
            embtype: this.parseTree_embtype(embtype_span),
            code: this.parseTree_code(code_span, indent + 1),
        };
    };
    NMLtool.prototype.parseTree_nmlnode = function (nodetitle_span, nodes_span, indent) {
        return {
            type: "nmlnode",
            span: [nodetitle_span[0], nodes_span[1]],
            nodetitle: this.parseTree_nodetitle(nodetitle_span),
            nodes: this.parseTree_nodes(nodes_span, indent + 1),
        };
    };
    NMLtool.prototype.parseTree_inline = function () {
    };
    NMLtool.prototype.parseTree_code = function (code_span, indent) {
        var text = "";
        var i = code_span[0];
        while (i < code_span[1]) {
            if (this.code[i - 1] == "\n") {
                i += indent * this.indentSpace;
            }
            text += this.code[i];
            i++;
        }
        return {
            type: "code",
            span: code_span,
            text: text,
        };
    };
    NMLtool.prototype.parseTree_embtype = function (embtype_span) {
    };
    NMLtool.prototype.parseTree_documenttitle = function (doctitle_span) {
        var _a;
        return { type: "documenttitle", span: doctitle_span, text: (_a = this.code).slice.apply(_a, doctitle_span) };
    };
    NMLtool.prototype.parseTree_nodetitle = function (nodetitle_span) {
        var _a;
        return { type: "nodetitle", span: nodetitle_span, text: (_a = this.code).slice.apply(_a, nodetitle_span) };
    };
    NMLtool.prototype.parseTree_trimIndent = function () {
    };
    return NMLtool;
}());
