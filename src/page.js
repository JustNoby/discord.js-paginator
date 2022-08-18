const { EmbedBuilder } = require('discord.js');

class Page {
    /**
     * To make a page
     * @param {string} title Displayed as the placeholder for select menu
     * @param {EmbedBuilder} embed An Embed
     * @param {string} content The content of the page
     */
    constructor(title, embed, content = null) {
        this.title = title;
        this.embed = embed;
        this.content = content;
    }
}

module.exports = Page;