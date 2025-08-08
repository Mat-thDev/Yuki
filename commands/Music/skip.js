const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

const { YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setDescription('Pula a música que está tocando'),
  category: "Music",
  async execute(interaction) {
    await interaction.deferReply();

    const player = useMainPlayer();
    const queue = player.nodes.get(interaction.guild);

    if (!queue || !queue.isPlaying()) {
      return interaction.editReply('❌ Nenhuma música está tocando agora.');
    }

    const skipped = queue.currentTrack;
    const success = queue.node.skip();

    if (!success) {
      return interaction.editReply('❌ Não foi possível pular a música.');
    }

    const embed = new EmbedBuilder()
      .setColor(YUKI_COLOR)
      .setTitle('⏭ Música pulada')
      .setDescription(`Você pulou: [${skipped.title}](${skipped.url})`)
      .setFooter({ text: '🌸 Yuki', iconURL: interaction.client.user.displayAvatarURL() })
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }
};
