const { SlashCommandBuilder } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('shuffle')
    .setDescription('🔀 Embaralha as músicas na fila'),
  category: "Music",
  async execute(interaction) {
    const queue = useQueue(interaction.guild.id);

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({ content: '❌ Não há música tocando no momento.', ephemeral: true });
    }

    queue.tracks.shuffle();

    return interaction.reply('🔀 A fila foi embaralhada.');
  }
};
