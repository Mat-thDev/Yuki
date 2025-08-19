const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('say')
    .setDescription('✏️ Faça eu dizer algo!')
    .addStringOption(option =>
      option.setName('text')
        .setDescription('O que devo dizer?')
        .setRequired(true)
    ),
  category: "Yuki",
  async execute(interaction, client) {
    const text = interaction.options.getString("text");
    await interaction.reply({ content: text });
    await interaction.deleteReply();
    return interaction.channel.send(text)
  }
}
