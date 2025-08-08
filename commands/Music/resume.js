const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

const { YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('resume')
    .setDescription('Retoma a reprodução da música pausada'),
  category: "Music",
  async execute(interaction) {
    await interaction.deferReply();

    const player = useMainPlayer();
    const queue = player.nodes.get(interaction.guild);

    if (!queue || !queue.isPlaying()) {
      return interaction.editReply('❌ Nenhuma música está tocando no momento.');
    }

    if (!queue.node.isPaused()) {
      return interaction.editReply('▶️ A música já está tocando.');
    }

    queue.node.resume();

    const embed = new EmbedBuilder()
      .setColor(YUKI_COLOR)
      .setTitle('▶️ Música retomada')
      .setDescription(`A reprodução foi retomada em <#${queue.metadata.channel.id}>.`)
      .setFooter({ text: '🌸 Yuki', iconURL: interaction.client.user.displayAvatarURL() })
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }
};
