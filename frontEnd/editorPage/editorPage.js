

let editor;
let oldState = [null,null];
let newDelta = [];
let latestOld = null;
let latestNew = null;
editor = new Quill("#editor", 
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

    editor.on('text-change', function(delta, oldDelta, source) {
        console.log(oldDelta);
        console.log(delta);
        latestOld = oldDelta;
        latestNew = delta;
        newDelta.push(delta);
      });




const save = document.body.querySelector(".save");
save.addEventListener("click", () => {
    oldState[0] = latestOld;
    oldState[1] = latestNew;
    newDelta = [];
    });
const restore = document.body.querySelector(".restore");
restore.addEventListener("click", () => {
    editor.setContents(oldState[0]);
    editor.updateContents(oldState[1]);
});