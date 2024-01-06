import { baseUrl,serverUrl } from "../config.js";
let quill;
let oldContent = [null,null];
const localUsername = localStorage["username"];
let writeLock = false;
let documentID = localStorage["currentDocument"];

let saveButton = document.getElementById("save");
let writeButton = document.getElementById("lock");
let releaseAccessButton = document.getElementById("unlock");
releaseAccessButton.setAttribute("disabled","true");
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
    // oldContent[0] = oldDelta;
    // oldContent[1] = delta;
    // newContent.push(delta);
    if(writeLock == false) return;
    connection.invoke("SendDocumentChanges",JSON.stringify(delta));
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

  writeButton.addEventListener("click",async () => {
    await connection.invoke("AcquireWriteLock");
  });

  releaseAccessButton.addEventListener("click",async () => {
    await connection.invoke("ReleaseWriteLock");
    releaseAccessButton.setAttribute("disabled","true");
  });


let connection = new signalR.HubConnectionBuilder().withUrl(serverUrl+"/editor-hub").build();
connection.on("handleRedisDocumentChanges",(content) => {
  console.log(content);
  content.forEach(element => {
    quill.updateContents(JSON.parse(element));
  });
});

connection.on("handleDeltaChanges",(newDelta) => {
  quill.updateContents(JSON.parse(newDelta));
});

connection.on("handleWriteLock",(username) => {
  if(username == localUsername)
  {
    writeLock = true;
    quill.enable(true);
    writeButton.setAttribute("disabled","true");
    releaseAccessButton.removeAttribute("disabled");
  }
  else{
    writeButton.setAttribute("disabled","true");
  }
});

connection.on("handleWriteRelease",() => {
  writeButton.removeAttribute("disabled");
  quill.enable(false);
  writeLock = false;
});

await connection.start();
await connection.invoke("SendMyInfo",documentID,localStorage["username"]);

// let documentObj = await (await fetch(serverUrl+`/Document/get-content/${documentID}`)).json();
// quill.setContents(documentObj[0]);
// quill.updateContents(documentObj[1]);

quill.enable(false);


