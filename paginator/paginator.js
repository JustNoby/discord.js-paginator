const { CommandInteraction, ButtonInteraction, ContextMenuCommandInteraction, AutocompleteInteraction, UserContextMenuCommandInteraction, ModalSubmitInteraction, SelectMenuInteraction, MessageContextMenuCommandInteraction, Message, ActionRowBuilder, InteractionType, Client, User, Guild } = require('discord.js');
const { returnInitialButtons, returnDisabledButtons, returnUpdatedButtons, createSelectMenu, EndButtonBuilder } = require('./paginatorSupport');
const PaginatorError = require('../paginator/paginatorError');
// {author_only: true, use_buttons: true, use_select: true, disable_after_timeout: true, remove_after_timeout: false}
/**
 * Paginator Class
 */
class Paginator {
    /**
     * To construct a Paginator based off of a InteractionType, A list of Pages and a time in seconds
     * @param {CommandInteraction | ButtonInteraction | SelectMenuInteraction | UserContextMenuCommandInteraction | ModalSubmitInteraction | MessageContextMenuCommandInteraction | ContextMenuCommandInteraction | AutocompleteInteraction } interaction Context of Interaction
     * @param {Page[]} embeds A list of embeds
     * @param {Number} seconds Cooldown time
     * @param {Object} options
     * @param {Boolean} [options.author_only = true] Whether the collector responds to the author or not
     * @param {Boolean} [options.use_buttons = true] Whether the Paginator uses buttons
     * @param {Boolean} [options.use_select = true] Whether the Paginator uses a select menu
     * @param {Boolean} [options.disable_after_timeout = true] Whether components disable after collector ends
     * @param {Boolean} [options.remove_after_timeout = true] Whether  components remove after collector ends
     */
    constructor(interaction, embeds, seconds = 60, options = {}) {
        this.interaction = interaction;
        this.embeds = embeds;
        this.time = seconds * 1000;
        this.author_only = options.use_buttons;
        this.use_buttons = options.use_buttons;
        this.use_select = options.use_select;
        this.disable_after_timeout = options.disable_after_timeout;
        this.remove_after_timeout = options.remove_after_timeout;
        this.msgid = undefined;
    }

    /**
     * Formats all the values you put into the options parameter. Necessary for Paginator process
     */
    formatOptions() {
        if (this.author_only === undefined) this.author_only = true;
        if (this.use_buttons === undefined) this.use_buttons = true;
        if (this.use_select === undefined) this.use_select = true;
        if (this.disable_after_timeout === undefined) this.disable_after_timeout = true;
        if (this.remove_after_timeout === undefined) this.remove_after_timeout = false;
    }

    /**
     * To run paginator
     * @returns {Promise}
     */
    async run() {
        this.formatOptions();
        const interaction = this.interaction;
        const embeds = this.embeds;
        let time = this.time;
        let userFilter, components = [];

        if (!interaction || !embeds) throw new PaginatorError("Invalid Paramter", "You're missing either interaction or embeds.");
        if (!(interaction.type === InteractionType.ApplicationCommand || InteractionType.ApplicationCommandAutocomplete || InteractionType.MessageComponent || InteractionType.ModalSubmit)) throw new PaginatorError("Invalid Interaction", "Interaction must be Application Command, Message Component, Modal Submit or a Context Menu interaction");
        if (embeds.length < 2) throw new PaginatorError("Invalid Pages", "Your embeds (Page[]) must be greater than 1.");
        if (time>60_000 || time<10_000) throw new PaginatorError("Invalid Time", "Time shouldn't be greater than 60 or less than 10.");
        if ([this.use_buttons, this.use_select] === [true, true]) throw new PaginatorError("Invalid Build", "You must at least have buttons, a select menu or both. You can't have neither.");

        if (this.author_only) userFilter = (i) => i.user.id === interaction.user.id;
        if (this.author_only) userFilter = undefined

        let index = 0;

        if (this.use_buttons) components.push(new ActionRowBuilder().setComponents(returnInitialButtons()));      
        if (this.use_select && this.use_buttons === true) components.push(new ActionRowBuilder().setComponents(createSelectMenu(index, embeds)));
        if (this.use_select && this.use_buttons === false) components.push(new ActionRowBuilder().setComponents(createSelectMenu(index, embeds)), new ActionRowBuilder().setComponents(new EndButtonBuilder()));



        const data = {
            content: embeds[index].content,
            embeds: [embeds[index].embed],
            components: components,
            fetchReply: true
        };

        /**
         * @type {Message}
         */
        const msg = interaction.replied ? await interaction.editReply(data) || await interaction.followUp(data) : await interaction.reply(data);

        this.msgid = msg.id;

        const col = msg.createMessageComponentCollector({
            filter: userFilter,
            time
        });

        col.on('collect', (interaction) => {
            components = [];
            if (interaction.customId === "pagination_minimum") index = 0;
            else if (interaction.customId === "pagination_behind") {
                if (index !== 0) {
                    index--;
                }
            } else if (interaction.customId === "pagination_forward") {
                if (index !== embeds.length - 1) {
                    index++;
                }
            } else if (interaction.customId === "pagination_maximum") index=embeds.length - 1
            else if (interaction.customId === "paginator_select_menu") {
                const the_page_user_wants = interaction.values[0];
                for (const page in embeds) {
                    if (embeds[page].title === the_page_user_wants) {
                        index = parseInt(page);
                    }
                }
            } else if (interaction.customId === "pagination_end_col") {
                if (this.interaction.user.id === interaction.user.id) return col.stop();
            };

            if (this.use_buttons) components.push(new ActionRowBuilder().setComponents(returnUpdatedButtons(index, embeds)));
            if (this.use_select && this.use_buttons === true) components.push(new ActionRowBuilder().setComponents(createSelectMenu(index, embeds)));
            if (this.use_select && this.use_buttons === false) components.push(new ActionRowBuilder().setComponents(createSelectMenu(index, embeds)), new ActionRowBuilder().setComponents(new EndButtonBuilder()));

            interaction.update({
                components: components,
                embeds: [embeds[index].embed],
                content: embeds[index].content
            }).catch(err => console.log(err));
        });

        col.on('end', async () => {
            components = [];
            let row1, row2;

            if (this.disable_after_timeout === false) row1 = new ActionRowBuilder().setComponents(returnDisabledButtons(false)), row2 = new ActionRowBuilder().setComponents(createSelectMenu(index, embeds, false));
            else if (this.disable_after_timeout === true) row1 = new ActionRowBuilder().setComponents(returnDisabledButtons(true)), row2 = new ActionRowBuilder().setComponents(createSelectMenu(index, embeds, true));

            if (this.remove_after_timeout === true) components = [];
            else if (this.remove_after_timeout === false) components = [row1, row2];

            await interaction.editReply({
                components: components
            });
        });
    }

    /**
     * Returns the Data the Paginator collected
     * @returns {{interaction: {interactionType: InteractionType, client: Client, channel: TextBasedChannel, user: User, guild: Guild, command: CommandInteraction | null, createdAt: Date, interactionId: String}, paginator: {pages: Page[], time: number, author_only: boolean, use_butons: boolean, disable_after_timeout: boolean, remove_after_timeout: boolean, messageId: string}}}
     */
    data() {
    return {
        interaction: {
            interactionType: this.interaction.type,
            client: this.interaction.client,
            channel: this.interaction.channel,
            user: this.interaction.user,
            guild: this.interaction.guild,
            command: this.interaction.command || null,
            createdAt: this.interaction.createdAt,
            interactionId: this.interaction.id
        },
        paginator: {
            pages: this.embeds,
            time: this.time,
            author_only: this.author_only,
            use_butons: this.use_buttons,
            use_select: this.use_select,
            disable_after_timeout: this.disable_after_timeout,
            remove_after_timeout: this.remove_after_timeout,
            messageId: this.msgid
        }
    }
}
}

module.exports = Paginator;