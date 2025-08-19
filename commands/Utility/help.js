const { SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } = require("discord.js");

const { YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("help")
    .setDescription("📰 Mostra a lista de comandos disponíveis"),
  category: "Utility",
  async execute(interaction) {
    const commands = interaction.client.commands;
    const categories = {};

    commands.forEach((cmd) => {
      const category = cmd.category || "Outros";
      if(category === "Dev") return;
      if (!categories[category]) categories[category] = [];
      categories[category].push(cmd.data);
    });

    const categoryNames = Object.keys(categories);
    if (categoryNames.length === 0) {
      return interaction.reply({
        content: "❌ Não há comandos disponíveis no momento.",
        flags: 64
      });
    }

    let pageIndex = 0;

    const generateEmbed = (index) => {
      const category = categoryNames[index];
      const cmds = categories[category];

      return new EmbedBuilder()
        .setTitle("📚 Central de Ajuda")
        .setDescription(`Aqui estão todos os comandos disponíveis organizados por categorias.\n\n**Categoria atual:** \`${category}\``)
        .setColor(YUKI_COLOR)
        .addFields({
          name: "📋 Comandos",
          value: cmds.map((c) => `• \`/${c.name}\` - ${c.description}`).join("\n"),
          inline: false
        })
        .setFooter({
          text: `Página ${index + 1}/${categoryNames.length} • ${interaction.client.user.username}`,
          iconURL: interaction.client.user.displayAvatarURL()
        })
        .setTimestamp();
    };

    try {
      const isMultiPage = categoryNames.length > 1;

      const row = isMultiPage ? new ActionRowBuilder().addComponents(
        new ButtonBuilder()
          .setCustomId("prev")
          .setLabel("Anterior")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("⬅️")
          .setDisabled(pageIndex === 0),
        new ButtonBuilder()
          .setCustomId("next")
          .setLabel("Próxima")
          .setStyle(ButtonStyle.Secondary)
          .setEmoji("➡️")
          .setDisabled(pageIndex === categoryNames.length - 1)
      ) : null;

      const messageOptions = {
        embeds: [generateEmbed(pageIndex)],
        components: isMultiPage ? [row] : []
      };

      const userDM = await interaction.user.send(messageOptions);
      await interaction.reply({
        content: "📬 Enviei a lista de comandos na sua DM!",
        flags: 64
      });

      if (!isMultiPage) return;

      const collector = userDM.createMessageComponentCollector({
        filter: i => i.user.id === interaction.user.id,
        time: 60000
      });

      collector.on("collect", async i => {
        if (i.customId === "prev" && pageIndex > 0) {
          pageIndex--;
        } else if (i.customId === "next" && pageIndex < categoryNames.length - 1) {
          pageIndex++;
        }

        const updatedRow = new ActionRowBuilder().addComponents(
          new ButtonBuilder()
            .setCustomId("prev")
            .setLabel("Anterior")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("⬅️")
            .setDisabled(pageIndex === 0),
          new ButtonBuilder()
            .setCustomId("next")
            .setLabel("Próxima")
            .setStyle(ButtonStyle.Secondary)
            .setEmoji("➡️")
            .setDisabled(pageIndex === categoryNames.length - 1)
        );

        await i.update({
          embeds: [generateEmbed(pageIndex)],
          components: [updatedRow]
        });
      });

      collector.on("end", () => {
        userDM.edit({ components: [] }).catch(() => {});
      });

    } catch (err) {
      console.error("Erro no comando help:", err);
      await interaction.reply({
        content: "❌ Não consegui enviar a mensagem na sua DM. Verifique se suas mensagens diretas estão habilitadas.",
        flags: 64
      });
    }
  },
};
