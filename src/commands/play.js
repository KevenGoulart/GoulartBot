const { EmbedBuilder, SlashCommandBuilder, CommandInteraction } = require('discord.js');

function trimStringWithDots(inputString, maxLength = 96) {
	if (inputString.length <= maxLength) {
		return inputString;
	} else {
		const trimmedString = inputString.substring(0, maxLength - 3).trim();
		return trimmedString + '...';
	}
}

module.exports = {
	name: ['play', 'p'],
	data: new SlashCommandBuilder()
		.setName('play').setDescription('Mim de nome ou link e eu toco a música')
		.addStringOption((input) => input.setName('prompt')
		.setDescription('Nome da música.')
		.setRequired(true).setAutocomplete(true)),
	/**
	 *
	 * @param {import('discord.js').Message | import('discord.js').CommandInteraction} message
	 * @param {string[]} args
	 */
	async execute(message, args) {
		/** @type {import('discord-player').Player} */
		const player = message.client['player'];
		const queue = player.nodes.get(message.guild.id);
		const voiceChannel = message.member?.voice?.channel;
		const searchQuery = message instanceof CommandInteraction ? message.options.getString('prompt', true) : args.join(' ');

		if (!voiceChannel) {
			return message.reply('Entra em um canal primeiro ai zé.');
		} else {
			if (message instanceof CommandInteraction) {
				await message.deferReply();
			}

			const search = await player.search(searchQuery);
			if (search.isEmpty()) return message instanceof CommandInteraction ?
				message.editReply('Não achei nada') : message.reply('Não achei nada');

			if (queue) {
				if (queue.channel.id !== voiceChannel.id) return message.reply('Você tem que estar no mesmo canal de voz');

				if (search.playlist) {
					const playlist = search.playlist;
					if (playlist.tracks < 1) return (message instanceof CommandInteraction) ? message.editReply(`Essa playlist ai ta vazia`) :
						message.reply(`Essa playlist ai ta vazia`)
	
					for (const track of playlist.tracks) {
						track.setMetadata(message); 
					}
	
					const { track } = await queue.play(playlist);
					return (message instanceof CommandInteraction) ? message.editReply({
						embeds: [
							new EmbedBuilder()
							.setColor('Blurple').setTitle(`Playlist carregada`)
							.setDescription(`${playlist?.title}`)
							.addFields({
								name: 'Duração', value: playlist?.durationFormatted,
								inline: true
							}, {
								name: 'Itens',
								value: `${playlist?.tracks?.length || 0} músicas`,
								inline: true
							})
							.setFooter({ text: `Adicionada por: ${message.member.user.username}` })
							.setThumbnail(track?.thumbnail)
							.setTimestamp()
						]
					}) : message.reply({
						embeds: [
							new EmbedBuilder()
							.setColor('Blurple').setTitle(`Playlist carregada`)
							.setDescription(`[${playlist?.title}](${playlist?.url})`)
							.addFields({
								name: 'Duração', value: playlist?.durationFormatted,
								inline: true
							}, {
								name: 'Itens',
								value: `${playlist?.tracks?.length || 0} tracks`,
								inline: true
							})
							.setFooter({ text: `Adicionada por: ${message.member.user.username}` })
							.setThumbnail(track?.thumbnail)
							.setTimestamp()
						]
					});
				}

				const { track } = await queue.play(search.tracks);

				return (message instanceof CommandInteraction) ? message.editReply({
					embeds: [
						new EmbedBuilder()
						.setColor('Red').setTitle(`Adicionada a fila`)
						.setDescription(`${track?.title} \`[${track?.duration}]\``)
						.setFooter({ text: `Adicionada por: ${message.member.user.username}` })
						.setThumbnail(track.thumbnail)
						.setTimestamp()
					]
				}) : message.reply({
					embeds: [
						new EmbedBuilder()
						.setColor('Red').setTitle(`Adicionada a fila`)
						.setDescription(`${track?.title} \`[${track?.duration}]\``)
						.setFooter({ text: `Adicionada por: ${message.member.user.username}` })
						.setThumbnail(track.thumbnail)
						.setTimestamp()
					]
				});
			}

			const queueConstruct = player.nodes.create(message.guild, {
				selfDeaf: true,
				leaveOnEnd: true,
				metadata: message,
				leaveOnEmpty: true,
				leaveOnEmptyCooldown: 5000,
				skipOnNoStream: true,
			});

			if (!queueConstruct.connection) await queueConstruct.connect(voiceChannel);
			if (search.playlist) {
				const playlist = search.playlist;
				if (playlist.tracks < 1) return (message instanceof CommandInteraction) ? message.editReply(`Essa playlist ai ta vazia`) :
					message.reply(`Essa playlist ai ta vazia`)

				for (const track of playlist.tracks) {
					track.setMetadata(message);
				}

				const { track } = await queueConstruct.play(playlist);
				return (message instanceof CommandInteraction) ? message.editReply({
					embeds: [
						new EmbedBuilder()
						.setColor('Blurple').setTitle(`Playlist carregada`)
						.setDescription(`${playlist?.title}`)
						.addFields({
							name: 'Duração', value: playlist?.durationFormatted,
							inline: true
						}, {
							name: 'Itens',
							value: `${playlist?.tracks?.length || 0} músicas`,
							inline: true
						})
						.setFooter({ text: `Adicionada por: ${message.member.user.username}` })
						.setThumbnail(track?.thumbnail)
						.setTimestamp()
					]
				}) : message.reply({
					embeds: [
						new EmbedBuilder()
						.setColor('Blurple').setTitle(`Playlist carregada`)
						.setDescription(`[${playlist?.title}](${playlist?.url})`)
						.addFields({
							name: 'Duração', value: playlist?.durationFormatted,
							inline: true
						}, {
							name: 'Itens',
							value: `${playlist?.tracks?.length || 0} músicas`,
							inline: true
						})
						.setFooter({ text: `Adicionada por: ${message.member.user.username}` })
						.setThumbnail(track?.thumbnail)
						.setTimestamp()
					]
				});
			}

			const { track } = await queueConstruct.play(search.tracks);
			return (message instanceof CommandInteraction) ? message.editReply({
				embeds: [
					new EmbedBuilder()
					.setColor('Red').setTitle(`Adicionada a fila`)
					.setDescription(`${track?.title} \`[${track?.duration}]\``)
					.setFooter({ text: `Adicionada por: ${message.member.user.username}` })
					.setThumbnail(track.thumbnail)
					.setTimestamp()
				]
			}) : message.reply({
				embeds: [
					new EmbedBuilder()
					.setColor('Red').setTitle(`Adicionada a fila`)
					.setDescription(`${track?.title} \`[${track?.duration}]\``)
					.setFooter({ text: `Adicionada por: ${message.member.user.username}` })
					.setThumbnail(track.thumbnail)
					.setTimestamp()
				]
			});
		}
	},
	/**
	 *
	 * @param {import('discord.js').CommandInteraction} interaction
	 * @returns
	 */
	async autocompleteRun(interaction) {
		/** @type {import('discord-player').Player} */
		const player = interaction.client['player'];
		const query = interaction.options.getString('prompt', true);
		if (!query || query.length < 1) return interaction.respond([{ name: 'Inválido, por favor passe uma música', value: '' }])
		const results = await player.search(query);

		return interaction.respond(
			results.tracks.slice(0, 6).map((t) => ({
				name: trimStringWithDots(t.title, 90),
				value: t.url
			}))
		);
	}
}