class PaginatorError extends Error {
    /**
     * @param {string} name
     * @param {string} message 
     */
    constructor(name, message) {
        super();
        this.message = message;
        this.name = `PaginatorError [${name}]`;
    }
}

module.exports = PaginatorError;