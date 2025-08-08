const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

const { YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setDescription('🔗 Mostra as músicas na fila'),
  category: "Music",
  async execute(interaction) {
    await interaction.deferReply();

    const player = useMainPlayer();
    const queue = player.nodes.get(interaction.guild);

    if (!queue || !queue.isPlaying()) {
      return interaction.editReply('❌ Nenhuma música está tocando no momento.');
    }

    const currentTrack = queue.currentTrack;
    const tracks = queue.tracks.toArray().slice(0, 10);

    const description = tracks.length
      ? tracks.map((track, i) => `**${i + 1}.** [${track.title}](${track.url}) • ${track.duration}`).join('\n')
      : 'Não há músicas na fila.';

    const embed = new EmbedBuilder()
      .setColor(YUKI_COLOR)
      .setTitle('🎶 Fila de reprodução')
      .setDescription(`**Tocando agora:** [${currentTrack.title}](${currentTrack.url}) • ${currentTrack.duration}\n\n` + description)
      .setFooter({ text: `🌸 Yuki - Total na fila: ${queue.tracks.size}` })
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }
};
