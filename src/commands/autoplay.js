const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

module.exports = {
	name: ['auto'],
    data: new SlashCommandBuilder()
    	.setName('auto').setDescription('Deixa as músicas por minha conta'),
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
                if (queue.channel.id !== voiceChannel.id) return message.reply('Você tem que estar no mesmo canal de voz.');

                let response = '';
                switch (queue.repeatMode) {
                    case 0:
                    case 1:
                    case 2:
                        queue.setRepeatMode(3);
                        response = 'Agora as músicas são por minha conta';
                        break;
                    default:
                        queue.setRepeatMode(0);
                        response = 'Chega de ser dj por enquanto';
                        break;
                }
               	return message.reply(response);
            }
            return message.reply('Não tem música na fila.');
        }
    }
}
