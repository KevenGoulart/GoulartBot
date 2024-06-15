const { SlashCommandBuilder, CommandInteraction } = require('discord.js');

module.exports = {
	name: ['loop', 'repeat'],
    data: new SlashCommandBuilder()
    	.setName('loop').setDescription('Ativa o modo loop'),
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

                let response = '';
                switch (queue.repeatMode) {
                    case 0:
                        queue.setRepeatMode(2);
                        response = 'Modo de repetição em fila, a fila atual vai se repetir';
                        break;
                    case 2:
                        queue.setRepeatMode(1);
                        response = 'Modo de repetição de faixa, a música atual vai se repetir';
                        break;
                    case 1:
                        queue.setRepeatMode(0);
                        response = 'Modo de repetição desligado, a fila atual vai continuar normalmente';
                        break;
                }
               	return message.reply(response);
            }
            return message.reply('Não tem música na fila');
        }
    }
}