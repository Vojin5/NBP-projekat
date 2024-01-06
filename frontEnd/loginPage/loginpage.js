import { serverUrl,baseUrl } from "../config.js";
let loginButton = document.getElementById("LoginloginButton");

//inputs
let usernameInput = document.getElementById("usernameLogin");
let passwordInput = document.getElementById("passwordLogin");

loginButton.addEventListener("click",async() => {
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

    const userLogin = await fetch (serverUrl + "/User/login", {
        method:"POST",
        headers:{
            "Content-Type":"application/json"
        },
        body: JSON.stringify({username:usernameInput.value, password: passwordInput.value})
    });
    if (!userLogin.ok) return;
    localStorage.setItem("username", usernameInput.value);
    window.location.href = baseUrl + "/frontEnd/homePage/homePage.html";
});