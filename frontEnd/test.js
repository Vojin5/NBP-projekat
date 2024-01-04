
let element = document.querySelector("trix-editor");
console.log(JSON.stringify(element.editor));

let savebtn = document.getElementById("save");
let loadbtn = document.getElementById("load");

savebtn.addEventListener("click", () => {
    console.log(JSON.stringify(element.editor));
    localStorage["editor-state"] = JSON.stringify(element.editor);
});

loadbtn.addEventListener("click", () => {
    element.editor.loadJSON(JSON.parse(localStorage["editor-state"]));
    console.log(JSON.parse(localStorage["editor-state"]));
});

