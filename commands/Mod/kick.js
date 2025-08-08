const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('kick')
    .setDescription('👢 Expulsa um usuário do servidor')
    .setDefaultMemberPermissions(PermissionFlagsBits.KickMembers)
    .addUserOption(option =>
      option.setName('usuário')
        .setDescription('Usuário para expulsar')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo da expulsão')
        .setRequired(false)
    ),

  category: "Moderation",

  async execute(interaction) {
    if (!interaction.member.permissions.has('KickMembers'))
      return interaction.reply({ content: '❌ Você não tem permissão para expulsar membros.', flags: 64 });

    const user = interaction.options.getUser('usuário');
    const motivo = interaction.options.getString('motivo') || 'Não especificado';

    const member = interaction.guild.members.cache.get(user.id);
    if (!member) return interaction.reply({ content: '❌ Usuário não encontrado no servidor.', flags: 64 });
    if (!member.kickable) return interaction.reply({ content: '❌ Não posso expulsar este usuário.', flags: 64 });

    try {
      await member.kick(motivo);

      const embed = new EmbedBuilder()
        .setTitle('👢 Usuário expulso')
        .setColor(YUKI_COLOR)
        .setDescription(`Usuário ${user.tag} foi expulso.\n**Motivo:** ${motivo}`)
        .setTimestamp()
        .setFooter({ text: '🌸 Yuki', iconURL: interaction.client.user.displayAvatarURL() });

      interaction.reply({ embeds: [embed] });
    } catch {
      interaction.reply({ content: '❌ Ocorreu um erro ao tentar expulsar o usuário.', flags: 64 });
    }
  }
};
