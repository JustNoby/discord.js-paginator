const { ButtonBuilder, ButtonStyle, SelectMenuBuilder, SelectMenuOptionBuilder } = require('discord.js');
const Page = require('./page');

class EndButtonBuilder extends ButtonBuilder {
    constructor() {
        super();
        this.data = {
            type: 2,
            emoji: { name: '❌' },
            style: 4,
            custom_id: 'pagination_end_col',
            label: 'End'
        };
    }
}

/**
 * Returns the Paginator class' initial buttons
 * @returns {ButtonBuilder[]} A list of buttons
 * 
*/
function returnInitialButtons() {
    return [
        new ButtonBuilder().setEmoji({name: "⏪"}).setStyle(ButtonStyle.Primary).setCustomId("pagination_minimum"),
        new ButtonBuilder().setEmoji({name: "◀️"}).setStyle(ButtonStyle.Primary).setCustomId("pagination_behind"),
        new ButtonBuilder().setEmoji({name: "▶️"}).setStyle(ButtonStyle.Primary).setCustomId("pagination_forward"),
        new ButtonBuilder().setEmoji({name: "⏩"}).setStyle(ButtonStyle.Primary).setCustomId("pagination_maximum"),
        new EndButtonBuilder()
    ];
}


/**
 * Returns updated buttons based on index
 * @param {Number} index The current embed index
 * @param {Page[]} embeds List of Page Embeds
 * @returns {ButtonBuilder[]} A list of buttons
*/
function returnUpdatedButtons(index, embeds) {
return [
    new ButtonBuilder().setEmoji({name: "⏪"}).setStyle(ButtonStyle.Primary).setCustomId("pagination_minimum"),
    new ButtonBuilder().setEmoji({name: "◀️"}).setStyle(ButtonStyle.Primary).setCustomId("pagination_behind").setDisabled(index === 0),
    new ButtonBuilder().setEmoji({name: "▶️"}).setStyle(ButtonStyle.Primary).setCustomId("pagination_forward").setDisabled(index === embeds.length - 1),
    new ButtonBuilder().setEmoji({name: "⏩"}).setStyle(ButtonStyle.Primary).setCustomId("pagination_maximum"),
    new EndButtonBuilder()
];
}

/**
 * Returns empty buttons
 * @param {Boolean} boolean Boolean for sure.
 * @returns {ButtonBuilder[]}
*/
function returnDisabledButtons(boolean = true) {
return [
    new ButtonBuilder().setEmoji({name: "⏪"}).setStyle(ButtonStyle.Primary).setCustomId("pagination_minimum").setDisabled(boolean),
    new ButtonBuilder().setEmoji({name: "◀️"}).setStyle(ButtonStyle.Primary).setCustomId("pagination_behind").setDisabled(boolean),
    new ButtonBuilder().setEmoji({name: "▶️"}).setStyle(ButtonStyle.Primary).setCustomId("pagination_forward").setDisabled(boolean),
    new ButtonBuilder().setEmoji({name: "⏩"}).setStyle(ButtonStyle.Primary).setCustomId("pagination_maximum").setDisabled(boolean)
];
}

/**
 * To create select menu
 * @param {Number} index The index of Embeds
 * @param {Page[]} embeds List of Page Embeds
 * @param {Boolean} boolean Boolean for sure
 * @returns {SelectMenuBuilder} Returns select menu
*/
function createSelectMenu(index, embeds, boolean = false) {
    let embedTitles = [];
    let selectMenuOptions = [];
    embeds.forEach((page) => {
        embedTitles.push(page.title);
    })

    let actual_index = parseInt(index+1);

    for (const page_title in embedTitles) {
        selectMenuOptions.push(
            new SelectMenuOptionBuilder()
                .setLabel(embedTitles[page_title])
                .setValue(embedTitles[page_title])
        )
    }
    return new SelectMenuBuilder()
        .setMaxValues(1)
        .setCustomId("paginator_select_menu")
        .setOptions(selectMenuOptions)
        .setPlaceholder(actual_index.toString() + ": " + embeds[index].title)  
        .setDisabled(boolean)     
}

module.exports = { returnInitialButtons, returnDisabledButtons, returnUpdatedButtons, createSelectMenu, EndButtonBuilder };