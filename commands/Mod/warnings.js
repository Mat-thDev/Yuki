const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const db = require('../../utils/database');
const { YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('warnings')
    .setDescription('⚠️ Lista os avisos de um usuário')
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)
    .addUserOption(option =>
      option.setName('usuário')
        .setDescription('Usuário para consultar avisos')
        .setRequired(true)
    ),

  category: "Moderation",
  async execute(interaction) {
    if (!interaction.member.permissions.has('ModerateMembers'))
      return interaction.reply({ content: '❌ Você não tem permissão para ver avisos.', flags: 64 });

    const user = interaction.options.getUser('usuário');

    const stmt = db.prepare('SELECT * FROM warns WHERE guild_id = ? AND user_id = ? ORDER BY timestamp DESC');
    const warns = stmt.all(interaction.guild.id, user.id);

    if (warns.length === 0)
      return interaction.reply({ content: `ℹ️ ${user.tag} não possui avisos neste servidor.`, flags: 64 });

    const warningsList = warns.map((w, i) => {
      const mod = interaction.client.users.cache.get(w.moderator_id);
      const date = new Date(w.timestamp).toLocaleString('pt-BR');
      return `**${i + 1}. [ID: ${w.id}]** Motivo: ${w.reason}\n   Moderador: ${mod ? mod.tag : 'Desconhecido'} | Data: ${date}`;
    }).join('\n\n');

    const embed = new EmbedBuilder()
      .setTitle(`⚠️ Avisos de ${user.tag}`)
      .setDescription(warningsList)
      .setColor(YUKI_COLOR)
      .setFooter({ text: '🌸 Yuki', iconURL: interaction.client.user.displayAvatarURL() })
      .setTimestamp();

    interaction.reply({ embeds: [embed] });
  }
};
