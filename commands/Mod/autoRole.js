const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const db = require("../../utils/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("autorole")
    .setDescription("💼 Ativa ou desativa a função de autocargo.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageRoles)
    .addBooleanOption((option) =>
      option
        .setName("ativar")
        .setDescription("Deseja ativar o autocargo?")
        .setRequired(true)
    )
    .addRoleOption((option) =>
      option
        .setName("cargo")
        .setDescription("Cargo que será atribuído automaticamente.")
        .setRequired(true)
    ),
  category: 'Moderation',
  async execute(interaction) {
    const ativar = interaction.options.getBoolean("ativar");
    const cargo = interaction.options.getRole("cargo");

    if (!interaction.guild) {
      return interaction.reply({
        content: "Este comando só pode ser usado em servidores.",
        flags: 64,
      });
    }

    if (!interaction.member.permissions.has("ManageRoles")) {
      return interaction.reply({
        content: "Você precisa da permissão **Gerenciar Cargos** para usar este comando.",
        flags: 64,
      });
    }

    if (!ativar) {
      db.prepare("DELETE FROM autorole WHERE guild_id = ?").run(interaction.guild.id);
      await interaction.reply({
        content: `✅ O sistema de autocargo foi **desativado**.`,
        flags: 64,
      });
      return;
    }

    db.prepare("INSERT OR REPLACE INTO autorole (guild_id, role_id) VALUES (?, ?)").run(interaction.guild.id, cargo.id);
    await interaction.reply({
      content: `✅ O sistema de autocargo foi **ativado** com o cargo: ${cargo}.`,
      flags: 64,
    });
  },
};
