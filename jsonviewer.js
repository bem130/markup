// MIT License - 2023 Neknaj - Bem130
// https://github.com/neknaj/jsonviewer

function showJSON(obj,elm,defaultopen=false,hidekey=[]) {
    elm.classList.add("jsonviewer");
    elm.innerHTML = "";
    elm.appendChild(json_child(obj,defaultopen,hidekey));
}
function json_child(obj,defaultopen=false,hidekey=[]) {
    if (obj instanceof Array) {
        let details = document.createElement("details");
        details.classList.add("array");
        details.open = defaultopen;
        let summary = document.createElement("summary");
        {
            let type = document.createElement("span");
            let length = document.createElement("span");
            let content = document.createElement("span");
            type.innerText = "Array";
            length.innerHTML = `(${obj.length})`;
            content.innerText = JSON.stringify(obj);
            content.classList.add("summary_content")
            summary.appendChild(type);
            summary.appendChild(length);
            summary.appendChild(content);
        }
        details.appendChild(summary);
        for (let i in obj) {
            let elm = obj[i];
            let index = document.createElement("span");
            let colon = document.createElement("span");
            let comma = document.createElement("span");
            let br = document.createElement("br");
            comma.classList.add("comma");
            index.classList.add("array_index");
            index.innerText = i;
            colon.innerText = ":";
            comma.innerText = ",";
            details.appendChild(index);
            details.appendChild(colon);
            details.appendChild(json_child(elm,defaultopen,hidekey));
            details.appendChild(comma);
            details.appendChild(br);
        }
        return details;
    }
    else if (obj instanceof Object) {
        let details = document.createElement("details");
        let summary = document.createElement("summary");
        {
            let type = document.createElement("span");
            type.innerText = "Object";
            let content = document.createElement("span");
            content.classList.add("summary_content")
            content.innerText = JSON.stringify(obj);
            summary.appendChild(type);
            summary.appendChild(content);
        }
        details.open = defaultopen;
        details.classList.add("object");
        details.appendChild(summary);
        for (let elm in obj) {
            if (hidekey.includes(elm)) {continue}
            let p = document.createElement("p");
            let addelm = json_child(elm,defaultopen,hidekey);
            let colon = document.createElement("span");
            let comma = document.createElement("span");
            addelm.classList.add("object_key");
            comma.classList.add("comma");
            colon.innerText = ":";
            comma.innerText = ",";
            p.appendChild(addelm);
            p.appendChild(colon);
            p.appendChild(json_child(obj[elm],defaultopen,hidekey));
            p.appendChild(comma);
            details.appendChild(p);
        }
        return details;
    }
    else {
        if (typeof obj === "string") {
            let span = document.createElement("span");
            let span1 = document.createElement("span");
            let span2 = document.createElement("span");
            let span3 = document.createElement("span");
            span.classList.add("string");
            span1.innerText = "\"";
            span3.innerText = "\"";
            span2.innerText = obj.toString();
            span.appendChild(span1);
            span.appendChild(span2);
            span.appendChild(span3);
            return span;
        }
        else if (typeof obj === "number") {
            let span = document.createElement("span");
            span.classList.add("number");
            span.innerText = obj.toString();
            return span;
        }
        else if (typeof obj === "boolean") {
            let span = document.createElement("span");
            span.classList.add("boolean");
            span.innerText = obj.toString();
            return span;
        }
        else {
            let span = document.createElement("span");
            if (obj!=null) {
                span.innerText = obj.toString();
            }
            return span;
        }
    }
}