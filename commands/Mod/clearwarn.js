const { SlashCommandBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('clearwarn')
    .setDescription('🗑️ Remove avisos de um usuário')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option.setName('usuário')
        .setDescription('Usuário para remover avisos')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('id')
        .setDescription('ID do aviso para remover (opcional)')
        .setRequired(false)
    ),

  category: "Moderation",

  async execute(interaction) {
    if (!interaction.member.permissions.has('ModerateMembers'))
      return interaction.reply({ content: '❌ Você não tem permissão para remover avisos.', flags: 64 });

    const user = interaction.options.getUser('usuário');
    const warnId = interaction.options.getInteger('id');

    if (warnId) {
      const info = db.prepare('DELETE FROM warns WHERE id = ? AND guild_id = ? AND user_id = ?').run(warnId, interaction.guild.id, user.id);

      if (info.changes === 0) {
        return interaction.reply({ content: `❌ Aviso com ID ${warnId} não encontrado para ${user.tag}.`, flags: 64 });
      }

      return interaction.reply({ content: `✅ Aviso com ID ${warnId} removido de ${user.tag}.` });
    } else {
      const info = db.prepare('DELETE FROM warns WHERE guild_id = ? AND user_id = ?').run(interaction.guild.id, user.id);

      if (info.changes === 0) {
        return interaction.reply({ content: `ℹ️ ${user.tag} não possui avisos para remover.`, flags: 64 });
      }

      return interaction.reply({ content: `✅ Todos os avisos de ${user.tag} foram removidos.` });
    }
  }
};
