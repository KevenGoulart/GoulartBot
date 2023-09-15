const { SlashCommandBuilder } = require('@discordjs/builders');

module.exports = {
    name: ['leave', 'disconnect'],
    data: new SlashCommandBuilder()
        .setName('leave').setDescription('Me manda embora do canal de voz (vai dar esse vacilo?)'),
    /**
     * 
     * @param {import('discord.js').Message} message 
     */
    async execute(message) {
        /** @type {import('discord-player').Player} */
        const player = message.client['player'];
        const queue = player.nodes.get(message.guild.id);
        const voiceChannel = message.member?.voice?.channel;

        if (!voiceChannel) {
            return message.reply('Você não tá em um canal de voz.');
        } else {
            if (queue) {
                if (queue.channel.id !== voiceChannel.id) return message.reply('Você tem que estar no mesmo canal de voz');
                if (voiceChannel.members.size > 1) {
                    if (!message.member.permissions.has('ModerateMembers')) return message.reply('Você não tem cargo pra isso');

                    queue.delete();
                    return message.reply('Eu sai do canal, a música parou 👋');
                }
            }

            return message.reply('Não tem música na fila');
        }
    }
}