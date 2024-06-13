const { Collection, EmbedBuilder, ActivityType } = require('discord.js');
const { Player } = require('discord-player');
const path = require('path');
const fs = require('fs');

/**
 * 
 * @param {import('discord.js').Client} client
 * 
 */
module.exports = async (client, prefix) => {
    client.commands = new Collection();

    const commandFiles = fs.readdirSync(path.join(__dirname, 'commands')).filter(file => file.endsWith('.js'));

    for (const file of commandFiles) {
        const command = require(`./commands/${file}`);

        if (command.name) {
            if (typeof command.name === "string") client.commands.set(command.name, command);
            if (Array.isArray(command.name)) {
                for (const alias of command.name) {
                    client.commands.set(alias, command);
                }
            }
        }
    }

    client.once('ready', () => {
        console.log(`Logado como: ${client.user.username}`);
        client.user.setPresence({
            status: 'idle',
            activities: [
                { name: `${track}`, type: ActivityType.Listening }
            ]
        });
    });

    client.on('messageCreate', (message) => {
        if (!message.content.startsWith(prefix) || message.author.bot) return;

        const args = message.content.slice(prefix.length).trim().split(/ +/);
        const commandName = args.shift().toLowerCase();
        const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

        if (!command) return;
        try {
            command.execute(message, args);
            delete require.cache[require.resolve(`./commands/${command.name[0]}.js`)];
        } catch (error) {
            console.error(error);
            message.reply('Deu merda aqui');
        }
    });

    client.on('interactionCreate', async (interaction) => {
        const { commandName } = interaction;
        const command = client.commands.get(commandName);

        if (interaction.isAutocomplete()) {
            if (typeof command.autocompleteRun === "function") await command.autocompleteRun(interaction);
            else return;
        } else if (interaction.isChatInputCommand()) {
            await command.execute(interaction);
        }
    });

    client.player = new Player(client);
    await client.player.extractors.loadDefault();
    
    client.player.events.on('playerStart', (queue, track) => {
    	if (queue.repeatMode === 0) return queue.metadata.channel.send({
        	embeds: [
        		new EmbedBuilder()
        		.setColor('Purple').setTitle(`Tocando agora`)
        		.setDescription(`${track?.title} \`[${track?.duration}]\``)
        		.setThumbnail(track.thumbnail)
        	]
        })
    });

    client.player.events.on('audioTrackAdd', (queue, track) => {
    	if (queue.repeatMode === 0) return client.user.setActivity("musiquinhas", {type: 'LISTENING'});
    });

    client.player.events.on('audioTrackAdd', (queue, track) => {
        if (!queue.isPlaying() && queue.tracks > 0 && !queue.isEmpty()) queue.revive();
    });

    client.player.events.on('willAutoPlay', async (queue, tracks) => {
        if (!tracks || tracks.length === 0) {
            return queue.metadata.channel.send("Não há músicas na lista de reprodução.");
        }
    
        const randomIndex = Math.floor(Math.random() * tracks.length);
        const trackToPlay = tracks[randomIndex];
    
        const { track } = await queue.play(trackToPlay);
        if (track) {
            return queue.metadata.channel.send({
                embeds: [
                    new EmbedBuilder()
                    .setColor('Purple')
                    .addFields({
                        name: '🔀 Música tocada automaticamente',
                        value: `Adicionada ${track?.title} \`[${track?.duration}]\` na fila`
                    })
                    .setThumbnail(track.thumbnail)
                ]
            });
        }
    });

    client.player.events.on('error', (queue, error) => {
        console.error(error);
    });

    client.player.events.on('playerError', async (queue, error, trackie) => {
        const { track } = await queue.play(`${trackie?.title}`, { searchEngine: 'soundcloudSearch' });

        return queue.metadata.channel.send({
            embeds: [
                new EmbedBuilder()
                .setColor('Purple')
                .addFields({
                    name: 'Achei uma alternativa no SoundCloud',
                    value: `Adicionada ${track?.title} \`[${track?.duration}]\` na fila!`
                })
				.setFooter({ text: `Adicionada por: ${queue.metadata.member.user.username}` })
				.setThumbnail(track.thumbnail)
				.setTimestamp()
            ]
        });
    });
}
