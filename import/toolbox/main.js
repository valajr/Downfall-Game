function getRandom(max) {
    return Math.floor(Math.random() * max);
}

function createButton(id, cl, text, action) {
    let button = document.createElement('button');
    button.id = id;
    button.classList.add(cl);
    button.innerHTML = text;
    button.addEventListener("click", action);

    return button;
}