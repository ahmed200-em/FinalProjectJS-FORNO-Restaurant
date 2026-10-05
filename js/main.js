let burgerMenu = document.querySelector("#burgerMenu");
let burgerLinks = document.querySelector(".burger-links");
let linkList = document.createElement("ul");
linkList.className = "burger-links-list";
linkList.innerHTML = `
    <li><a href="index.html">Accueil</a></li>
    <li><a href="menu.html">Menu</a></li>
    <li><a href="contact.html">Contact</a></li>
`;

burgerMenu.addEventListener("click", function () {
    console.log("clicked");
    if (burgerLinks.contains(linkList)) {
        burgerLinks.removeChild(linkList);

    } else {
        burgerLinks.appendChild(linkList);

    }

});