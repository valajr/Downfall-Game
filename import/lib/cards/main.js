/**
 * Card base.
 * 
 */
class Card {
    #action_function;

    /**
     * Constructor of the new element of class Card.
     * 
     * @param {string} id - id of the card
     * @param {string} name - name of the card
     * @param {string} type - type of the card
     * @param {string} img_front - image of the front of the card
     * @param {string} img_back - image of the back of the card
     * @param {string} description - description of the card
     */
    constructor(id, name, type, img_front, img_back, description='') {
        this.id = id;
        this.name = name;
        this.type = type;
        this.image = {
            'front': img_front,
            'back': img_back
        };
        this.description = description;        
    }

    //#region [GET-SET]
    set action(f) {
        this.#action_function = f;
    }
    get action() {
        return this.#action_function;
    }
    //#endregion

    /**
     * Method to return a instance of this card as an HTML element.
     * 
     * @returns HTML element of this card with the classes needed by styles.css
     */
    toHTML() {
        let card_body = createElementHTML("div", `libcards-card libcards-${this.type}`);
        card_body.onclick = () => {
            let card_id = document.getElementById(this.id);
            if (card_id.className.includes('libcards-reveal-card')) {
                return;
            }
            card_id.classList.add('libcards-reveal-card');
            
            this.action();
        }
        card_body.setAttribute("id", this.id);

        let card_front = createElementHTML("div", "libcards-face libcards-front");
        let card_name = document.createElement("span");
        card_name.innerHTML = this.name;
        card_front.appendChild(card_name);
        let card_front_img = document.createElement("img");
        card_front_img.src = this.image.front;
        card_front.appendChild(card_front_img);
        let card_description = document.createElement("span");
        card_description.innerHTML = this.description;
        card_front.appendChild(card_description);
        card_body.appendChild(card_front);

        let card_back = createElementHTML("div", "libcards-face libcards-back")
        card_back.style.backgroundImage = `url('${this.image.back}')`;
        card_body.appendChild(card_back);

        return card_body;
    }
}

/**
 * Deck base.
 * 
 */
class Deck {
    static cards = [];

    /**
     * Method to add card to deck.
     * 
     * @param {Card} card_instance - instance of class Card
     */
    static addCard(card_instance) {
        Deck.cards.push(card_instance);
    }

    /**
     * Method to remove one card with a given ID.
     * 
     * @param {string} card_id - ID of the card to be removed of the deck
     */
    static removeCardById(card_id) {
        cards = Deck.cards.filter(card => card.id != card_id);
    }

    /**
     * Method to remove cards of a given type.
     * 
     * @param {string} card_type - ID of the card to be removed of the deck
     */
    static removeCardsByType(card_type) {
        cards = Deck.cards.filter(card => card.type != card_type);
    }

    /**
     * Method to find a card with a given ID.
     * 
     * @param {string} card_id - ID of the card to be found in deck
     * @returns {Card} - returns the card of the given ID or null in case didn't encouter a card with that ID
     */
    static getCardById(card_id) {
        return Deck.cards.filter(card => card.id == card_id)[0] || null;
    }

    /**
     * Method to find cards with a given type.
     * 
     * @param {string} type - type of the cards to be found in deck
     * @returns {array Card} - array of cards with the given ID or a empty array in case didn't encounter a card with that type
     */
    static getCardsByType(type) {
        return Deck.cards.filter(card => card.type == type);
    }
}

/**
 * Function to create an element HTML with a given tag and class(es) name(s).
 * 
 * @param {string} tag - tag HTML to create an element HTML
 * @param {string} class_name - class(es) name(s) of the element HTML
 * @returns HTML element
 */
function createElementHTML(tag, class_name) {
    let element = document.createElement(tag);
    element.className = class_name;
    return element;
}