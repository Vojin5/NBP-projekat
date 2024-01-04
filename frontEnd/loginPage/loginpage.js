
let loginButton = document.getElementById("LoginloginButton");

//inputs
let usernameInput = document.getElementById("usernameLogin");
let passwordInput = document.getElementById("passwordLogin");

loginButton.addEventListener("click",() => {
    if(usernameInput.value == "")
    {
        alert("Enter username");
        return;
    }
    if(passwordInput.value == "")
    {
        alert("Enter password");
        return;
    }

    // TODO: dodati logiku za login i dodati da ako je login uspesan se predje na homePage
});