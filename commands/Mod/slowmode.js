const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('slowmode')
    .setDescription('⏱️ Define um slowmode no canal atual')
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageChannels)
    .addIntegerOption(option =>
      option.setName('tempo')
        .setDescription('Tempo do slowmode em segundos (0 para desativar)')
        .setRequired(true)
        .setMinValue(0)
        .setMaxValue(21600) // 6 horas max
    ),
  category: 'Moderation',
  async execute(interaction) {
    const tempo = interaction.options.getInteger('tempo');
    const channel = interaction.channel;

    try {
      await channel.setRateLimitPerUser(tempo, `Slowmode setado por ${interaction.user.tag}`);
      
      const embed = new EmbedBuilder()
        .setTitle('⌛ Slowmode atualizado')
        .setDescription(tempo > 0 ? `Slowmode definido para **${tempo} segundos**.` : 'Slowmode desativado.')
        .setColor(YUKI_COLOR)
        .setFooter({ text: '🌸 Yuki', iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

      return interaction.reply({ embeds: [embed], flags: 64 });
    } catch (error) {
      return interaction.reply({ content: '❌ Não consegui alterar o slowmode deste canal.', flags: 64 });
    }
  }
};
