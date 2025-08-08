const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');

const { YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('pause')
    .setDescription('Pausa a música que está tocando'),
  category: "Music",
  async execute(interaction) {
    await interaction.deferReply();

    const player = useMainPlayer();
    const queue = player.nodes.get(interaction.guild);

    if (!queue || !queue.isPlaying()) {
      return interaction.editReply('❌ Nenhuma música está tocando agora.');
    }

    if (queue.node.isPaused()) {
      return interaction.editReply('⏸ A música já está pausada.');
    }

    queue.node.pause();

    const embed = new EmbedBuilder()
      .setColor(YUKI_COLOR)
      .setTitle('⏸ Música pausada')
      .setDescription(`A música foi pausada em <#${queue.metadata.channel.id}>.`)
      .setFooter({ text: '🌸 Yuki', iconURL: interaction.client.user.displayAvatarURL() })
      .setTimestamp();

    return interaction.editReply({ embeds: [embed] });
  }
};
