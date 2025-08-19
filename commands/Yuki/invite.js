const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { CLIENT_ID, YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('invite')
    .setDescription('📧 Envia o link do convite para me adicionar em outros servidores!'),
  category: "Yuki",
  async execute(interaction, client) {
    const embed = new EmbedBuilder()
      .setColor(YUKI_COLOR)
      .setTitle('🌸 Yuki - Sua Assistente Multiuso')
      .setDescription([
        '🔗 **Me convide para seu servidor:**',
        `[Clique aqui](https://discord.com/api/oauth2/authorize?client_id=${CLIENT_ID}&permissions=8&scope=bot%20applications.commands)`,
      ].join('\n'))
      .setThumbnail(client.user.displayAvatarURL({ size: 512 }))
      .setFooter({
        text: 'Com amor, Yuki 💜',
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();
    await interaction.reply({ embeds: [embed] });
  }
}
