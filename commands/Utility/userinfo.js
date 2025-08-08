const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("userinfo")
    .setDescription("📌 Mostra informações detalhadas sobre um usuário")
    .addUserOption((option) =>
      option
        .setName("usuário")
        .setDescription("Selecione um usuário para exibir informações")
        .setRequired(false)
    ),
  category: 'Utility',
  async execute(interaction) {
    const user = interaction.options.getUser("usuário") || interaction.user;
    const member = await interaction.guild.members.fetch(user.id);

    const status = {
      online: "🟢 Online",
      idle: "🌙 Ausente",
      dnd: "⛔ Não perturbe",
      offline: "⚫ Offline",
    };

    const presence = member.presence?.status || "offline";
    const boostSince = member.premiumSince
      ? `<t:${Math.floor(member.premiumSinceTimestamp / 1000)}:R>`
      : "—";

    const embed = new EmbedBuilder()
      .setAuthor({
        name: `${user.tag}`,
        iconURL: user.displayAvatarURL({ dynamic: true }),
      })
      .setThumbnail(user.displayAvatarURL({ dynamic: true, size: 256 }))
      .setColor("Red")
      .setDescription(`🧾 Informações sobre ${user}`)
      .addFields(
        {
          name: "🧍 Informações Básicas",
          value: `• **Nome:** ${user.username}\n• **Tag:** #${user.discriminator}\n• **ID:** ${user.id}\n• **Bot:** ${user.bot ? "🤖 Sim" : "🙅 Não"}`,
        },
        {
          name: "📅 Datas Importantes",
          value: `• **Conta criada:** <t:${Math.floor(user.createdTimestamp / 1000)}:F>\n• **Entrou no servidor:** <t:${Math.floor(member.joinedTimestamp / 1000)}:F>`,
        },
        {
          name: "🔧 Status e Impulsos",
          value: `• **Status:** ${status[presence]}\n• **Boostando o servidor:** ${boostSince}`,
        },
        {
          name: "🎖️ Cargos",
          value:
            member.roles.cache
              .filter((r) => r.id !== interaction.guild.id)
              .sort((a, b) => b.position - a.position)
              .map((r) => r.toString())
              .join(", ") || "Nenhum cargo atribuído.",
        },
        {
          name: "🏆 Cargo mais alto",
          value: member.roles.highest.toString(),
          inline: true,
        }
      )
      .setFooter({
        text: `🌸 Yuki - Solicitado por ${interaction.user.tag}`,
        iconURL: interaction.user.displayAvatarURL({ dynamic: true }),
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
