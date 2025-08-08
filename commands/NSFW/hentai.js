const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const axios = require('axios');

const { YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('hentai')
    .setDescription('😈 Envia uma imagem Hentai (Somente para maiores hein)'),
  category: "NSFW",
  async execute(interaction, client) {

    if (!interaction.channel.nsfw) {
      return interaction.reply({
        content: "Você só pode executar esse comando em canais NSFW.",
        flags: 64,
      })
    }

    const { data } = await axios.get('https://nekobot.xyz/api/image', {
      params: {
        type: "hentai"
      }
    })

    const embed = new EmbedBuilder()
      .setColor(YUKI_COLOR)
      .setTitle('Hentai chegando!')
      .setImage(data.message)
      .setFooter({
        text: '🌸 Yuki',
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
