class PaginatorError extends Error {
    /**
     * @param {String} name
     * @param {String} message 
     */
    constructor(name, message) {
        super();
        this.message = message;
        this.name = `PaginatorError [${name}]`;
    }
}

module.exports = PaginatorError;