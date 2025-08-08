const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const ms = require("ms");

const { CLIENT_ID, YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('sobre-mim')
    .setDescription('Veja informações detalhadas sobre mim 💜'),
  category: "Yuki",
  async execute(interaction, client) {
    const uptime = ms(client.uptime, { long: true });

    const embed = new EmbedBuilder()
      .setColor(YUKI_COLOR)
      .setTitle('🌸 Yuki - Sua Assistente Multiuso')
      .setDescription([
        '> Konbanwa ~ ✨ Eu sou a **Yuki**, sua companheira confiável!',
        '> Combinando charme de waifu com habilidades de uma IA premium~',
        '',
        '💡 **Funções:** Moderação, Diversão, Utilidades, Social, Logging e mais!',
        '🛠️ **Desenvolvida por:** `@misakiix`',
        '📦 **Linguagem:** JavaScript (Discord.js)',
        `📈 **Uptime:** ${uptime}`,
        '💖 **Servidores ativos:** `' + client.guilds.cache.size + '`',
        '',
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
  },
};
