const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

const { YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('volume')
    .setDescription('🔊 Ajusta o volume da música')
    .addIntegerOption(option =>
      option.setName('nivel')
        .setDescription('Volume entre 0 e 100')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(100)
    ),
  category: "Music",
  async execute(interaction) {
    await interaction.deferReply();

    const volume = interaction.options.getInteger('nivel');
    const player = useMainPlayer();
    const queue = player.nodes.get(interaction.guild);

    if (!queue || !queue.isPlaying()) {
      return interaction.editReply('❌ Nenhuma música está tocando agora.');
    }

    queue.node.setVolume(volume);

    const embed = new EmbedBuilder()
      .setColor(YUKI_COLOR)
      .setTitle('🔊 Volume alterado')
      .setDescription(`Volume ajustado para **${volume}%**`)
      .setFooter({ text: '🌸 Yuki', iconURL: interaction.client.user.displayAvatarURL() })
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }
};
