const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { OWNER_ID, YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("reload")
    .setDescription("♻️ Recarrega dinamicamente um comando.")
    .addStringOption(option =>
      option
        .setName("categoria")
        .setDescription("📁 Categoria onde o comando está.")
        .setRequired(true)
    )
    .addStringOption(option =>
      option
        .setName("comando")
        .setDescription("📄 Nome do arquivo do comando (sem .js)")
        .setRequired(true)
    ),
  category: "Dev",
  async execute(interaction) {
    if (interaction.user.id !== OWNER_ID) {
      return interaction.reply({
        content: `🚫 Apenas a criadora da Yuki pode usar esse comando.`,
        ephemeral: true
      });
    }

    const cat = interaction.options.getString("categoria");
    const cmd = interaction.options.getString("comando");

    try {
      const path = `../${cat}/${cmd}.js`;
      delete require.cache[require.resolve(path)];
      const newCommand = require(path);

      interaction.client.commands.set(newCommand.data.name, newCommand);

      const embed = new EmbedBuilder()
        .setTitle("✨ Comando Recarregado!")
        .setDescription(`O comando \`/${cmd}\` foi recarregado com sucesso.`)
        .addFields(
          { name: "📁 Categoria", value: cat, inline: true },
          { name: "📄 Comando", value: cmd, inline: true }
        )
        .setColor(YUKI_COLOR)
        .setFooter({ text: "Yuki • Sistema de Desenvolvimento", iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

      return interaction.reply({ embeds: [embed], ephemeral: true });
    } catch (err) {
      console.error(err);
      return interaction.reply({
        content: `❌ Ocorreu um erro ao tentar recarregar \`${cmd}.js\` na categoria \`${cat}\`.\n\`\`\`${err.message}\`\`\``,
        ephemeral: true
      });
    }
  }
};
