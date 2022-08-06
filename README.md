# discord.js-paginator

Unofficial Message Paginator for @discord.js/discord.js

## <a id="top"></a> Table of Contents

- [Features](#features)
- [Installation](#install)
- [Dependencies](#dependencies)
- [Example](#examples)
  - [Example Image:](#exampleImg)
  - [Example](#example)
- [API Reference](#api)
- [Credits](#credits)

## <a id="features"></a> Features

- Embeds per messages or messages per embeds
- Index Select Menu and Buttons that can be manually turned off

### Ask me questions @ JustNoby#1001 on Discord

## <a id="install"></a> Installation

```bash
npm i @justnoby15/discord.js-paginator
```

### <a id="dependencies"></a> Dependencies

- [discord-js](https://www.npmjs.com/package/discord.js) (Version >= ^14.1.2)

## <a id="examples"></a> Examples

There are simple examples of what the code and actual output may look like.

### <a id="exampleImg"></a> Example Image

Paginator with Select Menu and Buttons:<br>
<img src="https://media.discordapp.net/attachments/1005177402135158875/1005261117074972692/unknown.png?width=669&height=145"></img>

### <a id="example"></a> Example

```js
client.on('interactionCreate', async (interaction) => {
    if (interaction.type === InteractionType.ApplicationCommand) {
        if (interaction.commandName === "test") {
            const pages = [
                new Page("Embed 1", new EmbedBuilder().setDescription("One")),
                new Page("Embed 2", new EmbedBuilder().setDescription("Two"), "Page #2")
            ]

            const paginator = new Paginator(interaction, pages, 15, {author_only: false});
            await paginator.run().catch(err => console.log(err));
        }
    }
});
```

## <a id="api"></a> Mini-Documentation

## <a id="page"></a> *class* Page

Instead of using list of Embeds offered by discord.js, you use a list of Pages from this class.

### Constructor

- `title: string`: Displayed as the placeholder for select Menu
- `embed: EmbedBuilder`: A discord.js embed
- `content: string | null`: The content of the Page (the message)

### Example

```js
const pages = [
    new Page("Embed 1", new EmbedBuilder().setDescription("One")),
    new Page("Embed 2", new EmbedBuilder().setDescription("Two"), "Page #2")
]

const paginator = new Paginator(..., pages, ...);
await paginator.run().catch(err => console.log(err));
```

# <a id="paginator"></a> *class* Paginator

## <a id="paginator"></a> *class* Paginator

### <a id="args"></a> Arguments

- [Required](#req)
- [Optional](#opt)
- [Attributes](#p_attrs)
- [Returns](#returns)

### <a id="req"></a> Required

- `interaction: CacheType`: Interaction Object
- `embeds: Page[]`: A list of embeds
    - Use the Page class
- `seconds: number`: Seconds for collector timeout

### <a id="opt"></a> Optional

- `options: Object`: An object holding further paginator options
    - `options.author_only: boolean = true`: Whether the Paginator responds to the author or not
    - `options.use_buttons: boolean = true`: Wether the Paginator has buttons
    - `options.use_select: boolean = true`: Whether the Paginator has a select menu
    - `options.disable_after_timeout: boolean = true`: Whether the Paginator disables after the timeout
    - `options.remove_after_timeout: boolean = false`: Whether the Pagiantor removes buttons after the timeout

### <a id="p_attrs"></a> Attributes

Data you can access using the Paginator's `data()` function.

```json
{
    interaction: {
        interactionType: InteractionType,
        client: Client,
        channel: TextBasedChannel,
        user: User,
        guild: Guild,
        command: CommandInteraction || null,
        createdAt: number,
        interactionId: string
    },
    paginator: {
        pages: Page[],
        time: number,
        author_only: boolean,
        use_butons: boolean,
        use_select: boolean,
        disable_after_timeout: boolean,
        remove_after_timeout: boolean,
        messageId: string
    }
}
```js
const paginator = new Paginator(interaction, pages, 15);
console.log(paginator.data());
```

## <a id="credits"></a> Credits

- [discord-js](https://www.npmjs.com/package/discord.js)
- Toricane's [interactions.py/Paginator](https://github.com/interactions-py/paginator)
- KrazyDeveloper's [Discord Paginator Tutorial](https://www.youtube.com/watch?v=adHoOi6zGmE&ab_channel=KrazyDeveloper)

[Back to top](#top)