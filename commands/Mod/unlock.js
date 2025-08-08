const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unlock')
    .setDescription('🔓 Destrava o canal atual, permitindo que membros enviem mensagens')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  category: 'Moderation',
  async execute(interaction) {
    const channel = interaction.channel;

    try {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: null,
      }, { reason: `Canal destravado por ${interaction.user.tag}` });

      const embed = new EmbedBuilder()
        .setTitle('🔓 Canal destravado')
        .setDescription('O canal foi desbloqueado para envio de mensagens.')
        .setColor(YUKI_COLOR)
        .setFooter({ text: '🌸 Yuki', iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      return interaction.reply({ content: '❌ Não consegui destravar o canal.', flags: 64 });
    }
  }
};
