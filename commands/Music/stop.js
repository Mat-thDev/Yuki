const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

const { YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setDescription('❌ Para a música e limpa a fila'),
  category: "Music",
  async execute(interaction) {
    await interaction.deferReply();

    const player = useMainPlayer();
    const queue = player.nodes.get(interaction.guild);

    if (!queue || !queue.isPlaying()) {
      return interaction.editReply('❌ Nenhuma música está tocando no momento.');
    }

    queue.node.stop();

    const embed = new EmbedBuilder()
      .setColor(YUKI_COLOR)
      .setTitle('⏹ Música parada')
      .setDescription(`A reprodução foi parada e a fila foi limpa.`)
      .setFooter({ text: '🌸 Yuki', iconURL: interaction.client.user.displayAvatarURL() })
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }
};
