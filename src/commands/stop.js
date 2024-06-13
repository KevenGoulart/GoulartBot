const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    name: ['stop', 'clear', 'cq'],
    data: new SlashCommandBuilder()
        .setName('stop').setDescription(`Limpa a fila atual.`),
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
            return message.reply('Você não tá em um canal de voz');
        } else {
            if (queue) {
                if (queue.channel.id !== voiceChannel.id) return message.reply('Você tem que estar no mesmo canal de voz');
                if (voiceChannel.members.size > 1) {
                    if (!message.member.permissions.has('ModerateMembers')) return message.reply('Você não tem cargo pra isso');
                    const queueSize = queue.getSize();

                    queue.clear();
                    return message.reply(`A fila foi limpa \`${queueSize}\` músicas foram removidas. 🧼`);
                }
            }

            return message.reply('Não tem música na fila');
        }
    }
}