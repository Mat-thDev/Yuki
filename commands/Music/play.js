const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');

const { YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('play')
    .setDescription('▶️ Toque uma música no canal de voz')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Nome ou URL da música')
        .setRequired(true)
    ),
  category: "Music",
  async execute(interaction) {
    await interaction.deferReply();

    const query = interaction.options.getString('query');
    const voiceChannel = interaction.member.voice.channel;

    if (!voiceChannel) {
      return interaction.editReply({ content: '❌ Você precisa estar em um canal de voz!' });
    }

    const player = useMainPlayer();
    let queue = useQueue(interaction.guild.id);

    if (!queue) {
      queue = player.nodes.create(interaction.guild.id, {
        metadata: {
          channel: interaction.channel
        },
        selfDeaf: true,
        volume: 50,
        leaveOnEmpty: true,
        leaveOnEmptyCooldown: 300000,
        leaveOnEnd: false
      });
    }

    try {
      await queue.connect(voiceChannel);
    } catch {
      return interaction.editReply('❌ Não consegui entrar no canal de voz.');
    }

    const result = await player.search(query, {
      requestedBy: interaction.user
    });

    if (!result.hasTracks()) {
      return interaction.editReply('❌ Nenhum resultado encontrado.');
    }

    const track = result.tracks[0];
    queue.addTrack(track);

    let embed;

    console.log('Estado da fila:', {
      isPlaying: queue.node.isPlaying(),
      currentTrack: queue.currentTrack,
      tracksCount: queue.tracks.size
    });

    if (!queue.node.isPlaying() && !queue.currentTrack) {
      await queue.node.play();

      embed = new EmbedBuilder()
        .setColor(YUKI_COLOR)
        .setTitle('▶️ Tocando agora')
        .setDescription(`[${track.title}](${track.url})`)
        .setThumbnail(track.thumbnail)
        .addFields(
          { name: '⏱ Duração', value: track.duration, inline: true },
          { name: '👤 Requisitado por', value: `${interaction.user}`, inline: true },
          { name: '💽 Fonte', value: track.source, inline: true }
        )
        .setFooter({ text: '🌸 Yuki', iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();
    } else {
      embed = new EmbedBuilder()
        .setColor(YUKI_COLOR)
        .setTitle('🎵 Música adicionada à fila')
        .setDescription(`[${track.title}](${track.url})`)
        .setThumbnail(track.thumbnail)
        .addFields(
          { name: '⏱ Duração', value: track.duration, inline: true },
          { name: '👤 Requisitado por', value: `${interaction.user}`, inline: true },
          { name: '💽 Fonte', value: track.source, inline: true }
        )
        .setFooter({ text: '🌸 Yuki', iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();
    }

    return interaction.editReply({ embeds: [embed] });
  }
};
