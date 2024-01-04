
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

sumbitButton.addEventListener("click", () => {
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
    // TODO: implementiraj logiku za registraciju i ako je registracija uspesna moze da se predje na homePage/loginPage
});

loginButton.addEventListener("click",() => {
    window.location.href = "./htmlTest.html";
});
