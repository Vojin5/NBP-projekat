import { serverUrl,baseUrl } from "../config.js";
//Buttons
let sumbitButton = document.getElementById("submitRegister");
let fileInput = document.getElementById("file-input");
let imageFile = null;
let loginButton = document.getElementById("RegisterloginButton");

//Inputs
let emailInput = document.getElementById("emailRegister");
let passwordInput = document.getElementById("passwordRegister");
let usernameInput = document.getElementById("usernameRegister");

fileInput.addEventListener("change",() => {
    let avatarButton = document.getElementById("avatarRegister");

    const file = fileInput.files[0];
    const reader = new FileReader();

    reader.onload = () => {
        avatarButton.innerHTML = "Avatar Added";
        avatarButton.style.backgroundColor = "green";
        imageFile = reader.result.toString().replace(/^data:(.*,)?/, '');
    }

    if(file)
    {
        reader.readAsDataURL(file);
    }
    else{
        imageFile = "";
    }

});

sumbitButton.addEventListener("click", async () => {
    if(usernameInput.value == "")
    {
        alert("Enter Username");
        return;
    }
    if(passwordInput.value == "")
    {
        alert("Enter password");
        return;
    }
    if(emailInput.value == "" || !(emailInput.value.toString().includes("@")))
    {
        alert("Enter email properly");
        return;
    }
    if(imageFile == null)
    {
        alert("Add avatar");
        return;
    } 
    console.log(JSON.stringify({username:usernameInput.value,
        password:passwordInput.value,
        email:emailInput.value,
        avatar:imageFile}));

    const userRegister = await fetch(serverUrl + "/User/register", {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({username:usernameInput.value,
            password:passwordInput.value,
            email:emailInput.value,
            avatar:imageFile})
    });
    if (!userRegister.ok)
    {
        alert("Bad username or password");
        return;
    } 
    window.location.href = baseUrl + "/frontEnd/loginPage/loginPage.html";
});

loginButton.addEventListener("click",() => {
    window.location.href = "../loginPage/loginPage.html";
});
