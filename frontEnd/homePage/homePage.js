
//labels
let userNameLabel = document.getElementById("userNameLabel");
//buttons
let createNewDocumentButton = document.getElementById("createNewDocument");
let modifyDocumentsButton = document.getElementById("modifyDocumentsButton");
//containers
let createNewDocumentContainer = document.querySelector(".createDocuments-container");
let modifyDocumentsContainer = document.querySelector(".documents-container");

createNewDocumentButton.addEventListener("click",() => {
    modifyDocumentsContainer.classList.remove("enabled");
    modifyDocumentsContainer.classList.add("disabled");

    createNewDocumentContainer.classList.remove("disabled");
    createNewDocumentContainer.classList.add("enabled");
});

modifyDocumentsButton.addEventListener("click",() => {
    modifyDocumentsContainer.classList.remove("disabled");
    modifyDocumentsContainer.classList.add("enabled");

    createNewDocumentContainer.classList.remove("enabled");
    createNewDocumentContainer.classList.add("disabled");
});


function injectCard(name,isOwner,isFavorite,people)
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
    injectCard("Test doc",true,true,["../resources/owner.png","../resources/owner.png","../resources/owner.png","../resources/owner.png","../resources/owner.png","../resources/owner.png","../resources/owner.png","../resources/owner.png","../resources/owner.png","../resources/owner.png","../resources/owner.png","../resources/owner.png"]));