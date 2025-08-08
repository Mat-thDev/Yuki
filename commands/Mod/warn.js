const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');
const { YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('⚠️ Adiciona um aviso a um usuário')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option.setName('usuário')
        .setDescription('Usuário a ser avisado')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo do aviso')
        .setRequired(true)
    ),

  category: "Moderation",

  async execute(interaction) {
    if (!interaction.member.permissions.has('ModerateMembers'))
      return interaction.reply({ content: '❌ Você não tem permissão para dar avisos.', flags: 64 });

    const user = interaction.options.getUser('usuário');
    const reason = interaction.options.getString('motivo');

    const stmt = db.prepare('INSERT INTO warns (guild_id, user_id, moderator_id, reason, timestamp) VALUES (?, ?, ?, ?, ?)');
    stmt.run(interaction.guild.id, user.id, interaction.user.id, reason, Date.now());

    const embed = new EmbedBuilder()
      .setTitle('⚠️ Aviso registrado')
      .setColor(YUKI_COLOR)
      .setDescription(`Usuário: ${user.tag}\nModerador: ${interaction.user.tag}\nMotivo: ${reason}`)
      .setTimestamp()
      .setFooter({ text: '🌸 Yuki', iconURL: interaction.client.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embed] });
  }
};
