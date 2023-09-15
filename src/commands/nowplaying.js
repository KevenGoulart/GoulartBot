const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const hhmmss = require('hhmmss');

module.exports = {
    name: ['nowplaying', 'np'],
    data: new SlashCommandBuilder()
        .setName('nowplaying').setDescription('Mostra a música que tá tocando'),
    /**
     * 
     * @param {import('discord.js').Message} message 
     */
    async execute(message) {
        /** @type {import('discord-player').Player} */
        const player = message.client['player'];
        const queue = player.nodes.get(message.guild.id);
        
        if (!queue || !queue.currentTrack) return message.reply('Não tem música na fila');

        return message.reply({
            embeds: [
                new EmbedBuilder().setColor('Blue')
                .setThumbnail(queue.currentTrack.thumbnail)
                .setTitle('Tocando agora')
                .setDescription(`${queue.isPlaying() ? queue.currentTrack.title : `⏸ ${queue.currentTrack.title}`} \n\`[${hhmmss(queue.node.getTimestamp().current.value / 1000)} / ${queue.currentTrack.duration}]\``)
            ]
        });
    }
}