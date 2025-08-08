const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('ban')
    .setDescription('🔨 Bane um usuário do servidor')
    .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
    .addUserOption(option =>
      option.setName('usuário')
        .setDescription('Usuário para banir')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo do banimento')
        .setRequired(false)
    ),
  category: "Moderation",
  async execute(interaction) {
    if (!interaction.member.permissions.has('BanMembers'))
      return interaction.reply({ content: '❌ Você não tem permissão para banir membros.', flags: 64 });

    const user = interaction.options.getUser('usuário');
    const motivo = interaction.options.getString('motivo') || 'Não especificado';

    const member = interaction.guild.members.cache.get(user.id);
    if (!member) return interaction.reply({ content: '❌ Usuário não encontrado no servidor.', flags: 64 });
    if (!member.bannable) return interaction.reply({ content: '❌ Não posso banir este usuário.', flags: 64 });

    try {
      await member.ban({ reason: motivo });

      const embed = new EmbedBuilder()
        .setTitle('🔨 Usuário banido')
        .setColor(YUKI_COLOR)
        .setDescription(`Usuário ${user.tag} foi banido.\n**Motivo:** ${motivo}`)
        .setTimestamp()
        .setFooter({ text: '🌸 Yuki', iconURL: interaction.client.user.displayAvatarURL() });

      interaction.reply({ embeds: [embed] });
    } catch (error) {
      interaction.reply({ content: '❌ Ocorreu um erro ao tentar banir o usuário.', flags: 64 });
    }
  }
};
