
//labels
let userNameLabel = document.getElementById("userNameLabel");
//buttons
let createNewDocumentButton = document.getElementById("createNewDocument"); // dugme za otvaranje dela za kreiranje (toggle)
let modifyDocumentsButton = document.getElementById("modifyDocumentsButton");
let addDocumentUsername = document.getElementById("documentAddUsername");
let createDocumentButton = document.getElementById("createDocumentButton"); // dugme za kreiranje
//containers
let createNewDocumentContainer = document.querySelector(".createDocuments-container");
let modifyDocumentsContainer = document.querySelector(".documents-container");
let documentUsernamesContainer = document.querySelector(".document-usernames-container");
//inputs
let documentNameInput = document.getElementById("documentName");
let documentUsernameInput = document.getElementById("documentUserName");

//Usernames array
let usernamesArray = [];

//Listener da prebaci na scenu za dodavanje novog dokumenta
createNewDocumentButton.addEventListener("click",() => {
    modifyDocumentsContainer.classList.remove("enabled");
    modifyDocumentsContainer.classList.add("disabled");

    createNewDocumentContainer.classList.remove("disabled");
    createNewDocumentContainer.classList.add("enabled");
});

//Listener da prebaci na scenu postojecih dokumenata
modifyDocumentsButton.addEventListener("click",() => {
    modifyDocumentsContainer.classList.remove("disabled");
    modifyDocumentsContainer.classList.add("enabled");

    createNewDocumentContainer.classList.remove("enabled");
    createNewDocumentContainer.classList.add("disabled");
});

//Dodavanje novog username-a u listu username-a
addDocumentUsername.addEventListener("click",() => {
    if(documentUsernameInput.value == "")
    {
        alert("Enter username to add to document access");
        return;
    }
    if(usernamesArray.includes(documentUsernameInput.value))
    {
        alert("Username already added");
        return;
    }
    let usernameElement = document.createElement("div");
    usernameElement.className = "username-card";
    usernameElement.innerHTML = documentUsernameInput.value;
    usernameElement.addEventListener("click",() => {
        let index = usernamesArray.indexOf(usernameElement.innerHTML);
        if(index != -1)
        {
            usernamesArray.splice(index,1);
        }
        documentUsernamesContainer.removeChild(usernameElement);
    });
    usernamesArray.unshift(documentUsernameInput.value);
    documentUsernamesContainer.insertBefore(usernameElement,documentUsernamesContainer.firstChild);
});

//Za zadate parametre kreira i vraca karticu za dokument
function createCard(name,isOwner,isFavorite,people)
{
    let cardContainer = document.createElement("div"); // Card container
    cardContainer.className = "document-card";

    let nameLabel = document.createElement("label"); // Card name label
    nameLabel.className = "card-label";
    nameLabel.innerHTML = name;
    cardContainer.appendChild(nameLabel);

    let attributesContainer = document.createElement("div"); // Attributes container for favourites and ownership
    attributesContainer.className = "attributes-container";
    let favouriteImg = document.createElement("img");
    favouriteImg.className = "card-img";
    if(isFavorite)
    {
        favouriteImg.src = "../resources/full_star.png";
    }
    else{
        favouriteImg.src = "../resources/empty_star.png";
    }
    attributesContainer.appendChild(favouriteImg);
    if(isOwner)
    {
        let ownerImg = document.createElement("img");
        ownerImg.src = "../resources/owner.png";
        ownerImg.className = "card-img";
        attributesContainer.appendChild(ownerImg);
    }
    cardContainer.appendChild(attributesContainer);

    let peopleContainer = document.createElement("div");
    peopleContainer.className = "card-people";
    people.forEach(element => {
        let newImg = document.createElement("img");
        newImg.src = element;
        newImg.className = "card-img";
        peopleContainer.appendChild(newImg);
    });
    cardContainer.appendChild(peopleContainer);

    let buttonsContainer = document.createElement("div");
    buttonsContainer.className = "buttons-container";

    let editButton = document.createElement("button");
    editButton.classList.add("card-button");
    editButton.innerHTML = "Edit";
    buttonsContainer.appendChild(editButton);

    if(isOwner)
    {
        let deleteButton = document.createElement("button");
        deleteButton.classList.add("card-button");
        deleteButton.innerHTML = "Delete";
        buttonsContainer.appendChild(deleteButton);
    }
    cardContainer.appendChild(buttonsContainer);
    return cardContainer;
}

// TODO: Fetch za dokumente datog korisnika
modifyDocumentsContainer.appendChild(
    createCard("Test doc",true,true,["../resources/owner.png","../resources/owner.png","../resources/owner.png","../resources/owner.png","../resources/owner.png","../resources/owner.png","../resources/owner.png","../resources/owner.png","../resources/owner.png","../resources/owner.png","../resources/owner.png","../resources/owner.png"]));