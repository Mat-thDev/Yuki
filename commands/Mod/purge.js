const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("purge")
    .setDescription("Deleta mensagens do canal atual")
    .addIntegerOption(option =>
      option.setName("quantidade")
        .setDescription("Número de mensagens a deletar (máx. 100)")
        .setRequired(true)
    )
    .addUserOption(option =>
      option.setName("membro")
        .setDescription("Filtrar por um membro específico")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.ManageMessages),

  category: 'Moderation',
  async execute(interaction) {
    const amount = interaction.options.getInteger("quantidade");
    const target = interaction.options.getUser("membro");

    if (amount > 100 || amount < 1) {
      return interaction.reply({
        content: "❌ Você deve fornecer um número entre 1 e 100.",
        flags: 64,
      });
    }

    await interaction.deferReply({ flags: 64 });

    const messages = await interaction.channel.messages.fetch({ limit: 100 });

    let filtered = messages
      .filter(m => !m.pinned)
      .first(amount);

    if (target) {
      filtered = messages
        .filter(m => m.author.id === target.id && !m.pinned)
        .first(amount);
    }

    try {
      const deleted = await interaction.channel.bulkDelete(filtered, true);
      return interaction.editReply(`🧹 Foram deletadas \`${deleted.size}\` mensagens${target ? ` de ${target.username}` : ""}.`);
    } catch (error) {
      console.error(error);
      return interaction.editReply("❌ Ocorreu um erro ao tentar deletar as mensagens.");
    }
  },
};
