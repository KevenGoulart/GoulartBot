const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: ['skip'],
    data: new SlashCommandBuilder()
        .setName('skip').setDescription('Pula a música atual'),
    /**
     * 
     * @param {import('discord.js').Message | import('discord.js').CommandInteraction} message 
     */
    async execute(message) {
        /** @type {import('discord-player').Player} */
        const player = message.client['player'];
        const voiceChannel = message.member?.voice?.channel;

        const queue = player.nodes.get(message.guild.id);

        if (!voiceChannel) {
            return message.reply('Você não tá em um canal de voz');
        } else {
            if (queue) {
                if (queue.channel.id !== voiceChannel.id) return message.reply('Você tem que estar no mesmo canal de voz');
                if (!queue.currentTrack) return message.reply('Não tem música pra ser pulada');
                if (!message.member.permissions.has('ModerateMembers')) return message.reply('KKKKKKKKKK o cara acha que tem moral pra isso');
                const skippedTrack = queue.currentTrack;

                queue.node.skip();
                return message.reply(`Pulada \`${skippedTrack.title}\``);
            }

            return message.reply('Não tem música na fila');
        }
    }
}