const { SlashCommandBuilder, EmbedBuilder } = require('@discordjs/builders');

module.exports = {
    name: ['help', 'commands'],
    data: new SlashCommandBuilder()
        .setName('help').setDescription('Mostra a lista de comandos disponíveis'),

    async execute(message) {
        return message.reply({
            embeds: [new EmbedBuilder()
                .setColor(0x4437db).setTitle(`${message.client.user.username} comandos disponíveis`)
                .setDescription('Uma ajudinha')
                .addFields([{
                    name: '[!autoplay] or /autoplay', value: 'Ativa o modo de fila automática', inline: false
                }, {
                    name: '[!help | !commands] or `/help`', value: 'Mostra os comandos disponíveis', inline: false
                }, {
                    name: '[!leave | !disconnect] or `/leave`', value: 'Me manda embora do canal de voz (vai dar esse vacilo?)', inline: false
                }, {
                    name: '[!nowplaying | !np] or `/nowplaying`', value: 'Mostra qual música tá tocando', inline: false
                }, {
                    name: '[!play (url/title) | !p (url/title)] or `/play (url/title)`', value: 'Toca uma música usando nome ou link', inline: false
                }, {
                    name: '[!queue | !q] or `/queue`', value: 'Mostra a fila atual', inline: false
                }, {
                    name: '[!skip] or `/skip`', value: 'Pula a música atual', inline: false
                }, {
                    name: '[!stop | !clearqueue | !cq] or `/stop`', value: 'Limpa a fila (não me faz sair da call)', inline: false
                }])
                     .setThumbnail(message.client.user.displayAvatarURL())
                     .setTimestamp()
            ]
        });
    }
}
