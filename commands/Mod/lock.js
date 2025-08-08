const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('lock')
    .setDescription('🔒 Trava o canal atual, impedindo que membros enviem mensagens')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels),
  category: 'Moderation',
  async execute(interaction) {
    const channel = interaction.channel;

    try {
      await channel.permissionOverwrites.edit(interaction.guild.roles.everyone, {
        SendMessages: false,
      }, { reason: `Canal trancado por ${interaction.user.tag}` });

      const embed = new EmbedBuilder()
        .setTitle('🔒 Canal travado')
        .setDescription('O canal foi bloqueado para envio de mensagens.')
        .setColor(YUKI_COLOR)
        .setFooter({ text: '🌸 Yuki', iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

      return interaction.reply({ embeds: [embed] });
    } catch (error) {
      return interaction.reply({ content: '❌ Não consegui travar o canal.', flags: 64 });
    }
  }
};
