const { EmbedBuilder, SlashCommandBuilder } = require('discord.js');
const hhmmss = require('hhmmss');

module.exports = {
    name: ['queue', 'q'],
    data: new SlashCommandBuilder()
        .setName('queue').setDescription('Mostra a fila atual'),
    /**
     * 
     * @param {import('discord.js').Message | import('discord.js').CommandInteraction} message 
     */
    async execute(message) {
        /** @type {import('discord-player').Player} */
        const player = message.client['player'];
        const queue = player.nodes.get(message.guild.id);
        
        if (!queue || !queue.currentTrack) return message.reply('Não tem música na fila');
        const firstTen = queue.tracks.toArray().slice(0, 10);

        const initialTimeLeft = (queue.currentTrack.durationMS - queue.node.getTimestamp().current.value) / 1000;
        const queueTimeLeft = ((queue.estimatedDuration + queue.currentTrack.durationMS) - queue.node.getTimestamp().current.value) / 1000;
        const overallQueue = ((queue.estimatedDuration + queue.currentTrack.durationMS));
        let iterator = 0;

        return message.reply({
            embeds: [
                new EmbedBuilder().setColor('Blue')
                .setThumbnail(queue.currentTrack.thumbnail)
                .setTitle(`Fila para ${message.guild.name}`)
                .addFields({
                    name: 'Tocando agora',
                    value: `${queue.currentTrack.title} \`[${hhmmss(queue.node.getTimestamp().current.value / 1000)} / ${queue.currentTrack.duration}]\``,
                    inline: true
                },
                {
                    name: 'Itens',
                    value: `${queue?.tracks?.size || 0} músicas`,
                    inline: true
                },
                {
                    name: 'Próxima',
                    value: firstTen.length < 1 ? 'Não tem música na fila' : firstTen.map((track) => {
                        let totalTime = initialTimeLeft;
                        for (let i = 1; i <= iterator; i++) {
                            totalTime += queue.tracks.toArray()[i]?.durationMS / 1000;
                        }

                        return `${++iterator}. ${track.title}  \`[${track.duration}]\` \`(${hhmmss(totalTime)} sobrando)\``
                    }).join('\n')
                })
                .setFooter({ text: `Duração total: ${hhmmss(overallQueue / 1000)} | Tempo restante: ${hhmmss(queueTimeLeft)}` })
            ]
        })
    }
}