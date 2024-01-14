function NML_showAsHTML(obj,elm) {
    elm.classList.add("nmll");
    elm.classList.add("nmlhtml");
    elm.innerHTML = "";
    elm.appendChild(NML_html_document(obj));
}
function NML_html_document(obj) {
    let elm = document.createElement("div");
    if (obj.type=="document") {
        let h1 = document.createElement("h1");
        h1.innerText = obj.documenttitle.text;
        elm.appendChild(h1);
        let div = document.createElement("div");
        div.classList.add("document_body");
        NML_html_nodes(div,obj.nodes,1)
        elm.appendChild(div);
    }
    return elm;
}
function NML_html_nodes(parent,nodes,level) {
    for (let node of nodes) {
        switch (node.type) {
            case "paragraph":
                {
                    let p = document.createElement("p");
                    p.classList.add("paragraph");
                    for (let content of node.contents) {
                        let span = document.createElement("span");
                        span.innerHTML = NML_html_replace(content.text);
                        p.appendChild(span);
                        let br = document.createElement("br");
                        p.appendChild(br);
                    }
                    parent.appendChild(p);
                }
            break;
            case "nmlnode":
                {
                    let elm = document.createElement("div");
                    elm.classList.add("nmlnode");
                    let title = document.createElement(`h${level+1}`);
                    title.innerHTML = NML_html_replace(node.nodetitle.text);
                    elm.appendChild(title);
                    let div = document.createElement("div");
                    div.classList.add("document_body");
                    NML_html_nodes(div,node.nodes,level+1)
                    elm.appendChild(div);
                    parent.appendChild(elm)
                }
            break;
            case "block":
                {
                    let pre = document.createElement("pre");
                    pre.classList.add("blockcode_area");
                    let code = document.createElement("code");
                    code.classList.add("blockcode");
                    code.innerText = node.code.text;
                    pre.appendChild(code);
                    parent.appendChild(pre);
                }
            break;
        }
    }
}
function NML_html_replace(str) {
    return str.replace(/ /g,"&nbsp;");
}