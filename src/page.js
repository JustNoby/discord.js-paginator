const { EmbedBuilder } = require('discord.js');

class Page {
    /**
     * To make a page
     * @param {string|null} title Displayed as the placeholder for select menu
     * @param {EmbedBuilder|null} embed An Embed
     * @param {string|null} content The content of the page
     */
    constructor(title, embed, content = null) {
        this.title = title;
        this.embed = embed;
        this.content = content;
    }

    /**
     * To set title of Page
     * @param {string|null} content The title of page 
     */
    setTitle(content) {
        this.title = content;
        return this
    }
    
    /**
     * To set embed of page
     * @param {EmbedBuilder|null} embed The embed of page
     */
    setEmbed(embed) {
        this.embed = embed;
        return this
    }

    /**
     * To set message content of a page
     * @param {string|null} content 
     */
    setMessageContent(content) {
        this.content = content;
        return this
    }
}

module.exports = Page;