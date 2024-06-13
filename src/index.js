require('dotenv').config();
const { Client, IntentsBitField , ActivityType, GatewayIntentBits, REST, Routes } = require('discord.js');
const { clientId, guildId } = require('./config');

const client = new Client({
    intents: [
        IntentsBitField.Flags.Guilds,
        IntentsBitField.Flags.GuildMembers,
        IntentsBitField.Flags.GuildMessages,
        IntentsBitField.Flags.MessageContent,
        IntentsBitField.Flags.GuildVoiceStates,
        GatewayIntentBits.Guilds,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences
    ]
});

const rest = new REST().setToken(process.env.TOKEN);

const prefix = '!';
require('./loader')(client, prefix);

(async () => {
    const commands = [...new Set(Array.from(client.commands.values()))];

    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);

        for (const guild of guildId.split('|')) {
            const data = await rest.put (
                Routes.applicationGuildCommands(clientId, guild),
                { body: commands.map(command => command.data.toJSON()) },
            );
    
            console.log(`Successfully reloaded ${data.length} application (/) commands.`);
        }
    } catch (error) {
        console.error(error);
    }

})();

client.on('ready', (c) => {
    console.log(`${c.user.username} ta on`)
<<<<<<< HEAD
=======

    client.user.setActivity({
        name: 'Dando um tapa na pantera CI',
        type: ActivityType.Custom
    })
>>>>>>> 35e6971146abcaf3111b1ec9962df49346c789cf
});

client.on('messageCreate', (message) => {
    if (message.author.bot) {
        return;
    }
});

client.login(process.env.TOKEN);