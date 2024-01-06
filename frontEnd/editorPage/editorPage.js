import { baseUrl,serverUrl } from "../config.js";
let quill;
let oldContent = [null,null];
let newContent = [];
let currentOld = null;
let currentNew = null;

let documentID = localStorage["currentDocument"];

let saveButton = document.getElementById("save");
quill = new Quill("#editor", 
    {
        theme: 'snow',
        modules: {
            toolbar: [
              ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
              ['blockquote', 'code-block'],
      
              [{ 'header': 1 }, { 'header': 2 }],               // custom button values
              [{ 'list': 'ordered'}, { 'list': 'bullet' }],
              [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
              [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
              [{ 'direction': 'rtl' }],                         // text direction
      
              [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
      
              [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
              [{ 'font': [] }],
              [{ 'align': [] }],
      
              ['image'],
      
              ['clean']                                         // remove formatting button
            ],
          },
          placeholder: 'Compose an epic...',
        }
    );

    quill.on('text-change', function(delta, oldDelta, source) {
      oldContent[0] = oldDelta;
      oldContent[1] = delta;
      newContent.push(delta);
    });

    saveButton.addEventListener("click",async() => {
      const result = await fetch(serverUrl + `/Document/add-content/${documentID}`,
      {
        method:"POST",
        headers:{
          "Content-Type":"application/json"},
        body:JSON.stringify(oldContent)
      })
    });




let documentObj = await (await fetch(serverUrl+`/Document/get-content/${documentID}`)).json();
quill.setContents(documentObj[0]);
quill.updateContents(documentObj[1]);
