<div id="top" align='center'>
    <h1>discord.js-paginator</h1>
    <p><i>Unofficial</i> Paginator for @discordjs/discord.js supporting Slash commands</p>
    <img alt='npm Version' src='https://img.shields.io/npm/v/@justnoby15/discord.js-paginator?style=for-the-badge'>
    <img alt='npm Downloads' src='https://img.shields.io/npm/dw/@justnoby15/discord.js-paginator?style=for-the-badge'>
</div>

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Dependencies](#dependencies)
- [Examples](#examples)
  - [Code Example](#code)
- [API Reference](#documentation)
- [Credits](#credits)

## Features

- Paginates embeds, but can also have message content
- Index Select Menu and Buttons that can be manually turned off
- Slash Command only support

### Ask me questions @ JustNoby#1001 on Discord

## Installation

```bash
npm i @justnoby15/discord.js-paginator
```

### Dependencies

- [discord-js](https://www.npmjs.com/package/discord.js) (Version >= ^14.1.2)

## Examples

There are simple examples of what the code and actual output may look like. Keep in mind, as of version 0.0.3 of the paginator, Messages as the interaction data aren't handled.

Paginator with Select Menu and Buttons:<br>
<img src="https://media.discordapp.net/attachments/1005177402135158875/1005261117074972692/unknown.png?width=669&height=145"></img>

### Code

```js
const { Paginator, Page } = require('@justnoby15/discord.js-paginator');
const { REST } = require('@discordjs/rest'); // Paginator does not support Message Objects as to adjust everyone to using Discord's suggested Slash Commands.
const { Client, GatewayIntentBits, InteractionType, Routes, EmbedBuilder } = require('discord.js');

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);

  const commands = [
    {
      name: 'test',
      description: 'test for pro package',
    },
  ];
  
  const rest = new REST({ version: '10' }).setToken('your_token_may_go_here');
  
  (async () => {
    try {
      await rest.put(Routes.applicationCommands(client.user.id), { body: commands });
  
      console.log('Successfully registered commands.');
    } catch (error) {
      console.error(error);
    }
  })();
});

client.on('interactionCreate', async (interaction) => {
    if (interaction.type === InteractionType.ApplicationCommand) {
        if (interaction.commandName === "test") {
            const pages = [
                new Page("Embed 1", new EmbedBuilder().setDescription("One")),
                new Page("Embed 2", new EmbedBuilder().setDescription("Two"), "Page #2"),
                new Page("Embed 3", new EmbedBuilder().setDescription("Three"), "Page #3")
            ]

            const paginator = new Paginator(interaction, pages, 15, {authorOnly: false});
            await paginator.run().catch(err => console.log(err));
        }
    }
});

client.login('your_token_can_go_here');
```

## Documentation

## *class* Page

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

## *class* Paginator

### Arguments

- [Required](#required)
- [Optional](#optional)
- [Attributes](#attributes)
- [Methods](#methods)

### Required

- `interaction: CacheType`: Interaction Object
- `embeds: Page[]`: A list of embeds
    - Use the Page class
- `seconds: number`: Seconds for collector timeout

### Optional

- `options: Object`: An object holding further paginator options
    - `options.authorOnly: boolean = true`: Whether the Paginator responds to the author or not
    - `options.useButtons: boolean = true`: Wether the Paginator has buttons
    - `options.useSelect: boolean = true`: Whether the Paginator has a select menu
    - `options.deferReply: boolean = false`: Whether the Paginator defers initial reply
    - `options.editReply: boolean = false`: Whether the Paginator edits the initial interaction reply
    - `options.disableAfterTimeout: boolean = true`: Whether the Paginator disables after the timeout
    - `options.removeAfterTimeout: boolean = false`: Whether the Paginator removes buttons after the timeout
    - `options.deleteAfterTimeout: boolean = false`: Whether the Paginator deletes the message after the timeout

### Attributes

Data you can access using the Paginator's `data()` function.

```js
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
        authorOnly: boolean,
        use_butons: boolean,
        useSelect: boolean,
        deferReply: boolean,
        editReply: boolean,
        disableAfterTimeout: boolean,
        removeAfterTimeout: boolean,
        deleteAfterTimeout: boolean
        messageId: string
    }
}
```

```js
const paginator = new Paginator(interaction, pages, 15);
console.log(paginator.data());
```


### Methods

- `formatOptions()`: Formats all the values you put into the options parameter. Necessary for Paginator process, however user is not inquired to use this function, the paginator already does it for you.
    - What does it do exactly? It simply checks for undefined properties and sets them to default.
- `compileErrors()`: A function that catches all errors you could have based on your inputs.
    - Returns a Promise: This is so users could check if there Paginator inputs were wrong before running the bot, but this is not required and **NOT** recommended, because Paginator does it for you. Though, you can use the script like this now:
    ```js
    const paginator = new Paginator(interaction, pages, 15, {useButtons: false, useSelect: false}); // The options throw Invalid Build error
    await paginator.compileErrors().catch(err => console.log(err)).then(async () => await paginator.run());
    ```
- `run()`: The Paginator
    - [Required](#required)
    - [Optional](#optional)
    - [Attributes](#attributes)
- `data()`: Returns all Paginator [Attributes](#attributes)

## Credits

- [discord-js](https://www.npmjs.com/package/discord.js)
- Toricane's [interactions.py/Paginator](https://github.com/interactions-py/paginator)
- KrazyDeveloper's [Discord Paginator Tutorial](https://www.youtube.com/watch?v=adHoOi6zGmE&ab_channel=KrazyDeveloper)

[Back to top](#top)