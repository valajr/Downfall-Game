function getRandom(max) {
    return Math.floor(Math.random() * max);
}

function createHTML(tag, id, cl, text, action='') {
    let element = document.createElement(tag);
    element.id = id;
    element.classList.add(cl);
    element.innerHTML = text;
    element.onclick = action;

    return element;
}