const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const oqpq = require('../../assets/wouldyourather.json');
const progressbar = require('string-progressbar');

const { YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('oqueprefere')
    .setDescription('❓ Jogo "O que você prefere?"'),

  category: "Games",
  async execute(interaction) {
    const index = Math.floor(Math.random() * oqpq.length);
    const question = oqpq[index];

    const embedQuestion = new EmbedBuilder()
      .setAuthor({ name: 'O que você prefere?', iconURL: 'https://images-na.ssl-images-amazon.com/images/I/61qsWw4O5IL.png' })
      .setDescription(question)
      .setColor(YUKI_COLOR)
      .setFooter({ text: `Reaja com 1️⃣ ou 2️⃣ para escolher`, iconURL: interaction.client.user.displayAvatarURL() });

    await interaction.reply({ embeds: [embedQuestion] });

    const message = await interaction.fetchReply();

    await message.react('1️⃣');
    await message.react('2️⃣');

    const filter = (reaction, user) => {
      return ['1️⃣', '2️⃣'].includes(reaction.emoji.name) && user.id === interaction.user.id;
    };

    const collector = message.createReactionCollector({ filter, max: 1, time: 60_000 });

    collector.on('collect', reaction => {
      const rate = Math.floor(Math.random() * 100);
      const bar = progressbar.filledBar('100', rate, 27, '🟥', '🟦')[0];

      const embedResult = new EmbedBuilder()
        .setAuthor({ name: 'O que você prefere?', iconURL: 'https://images-na.ssl-images-amazon.com/images/I/61qsWw4O5IL.png' })
        .setTitle(`${rate}% das pessoas concordam com você.`)
        .setDescription(bar)
        .setColor(YUKI_COLOR);

      interaction.editReply({ embeds: [embedResult] });
    });

    collector.on('end', (collected) => {
      if (collected.size === 0) {
        message.reply('⏰ Tempo esgotado! Você não escolheu nenhuma opção.');
      }
    });
  }
};
