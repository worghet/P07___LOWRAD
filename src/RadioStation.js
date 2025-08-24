export default class RadioStation {
    #id;
    #name;
    #url;

    constructor(id, name, url) {
        this.#id = id;
        this.#name = name;
        this.#url = url;
    }

    getName() { return this.#name; }
    getUrl() { return this.#url; }
}