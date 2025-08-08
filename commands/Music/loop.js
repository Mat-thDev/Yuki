const { SlashCommandBuilder } = require('discord.js');
const { useQueue, QueueRepeatMode } = require('discord-player');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setDescription('Define o modo de repetição da música/fila')
    .addStringOption(option =>
      option.setName('mode')
        .setDescription('Modo de repetição')
        .setRequired(true)
        .addChoices(
          { name: 'Desativado', value: 'off' },
          { name: 'Música atual', value: 'track' },
          { name: 'Fila inteira', value: 'queue' }
        )
    ),
  category: "Music",
  async execute(interaction) {
    const mode = interaction.options.getString('mode');
    const queue = useQueue(interaction.guild.id);

    if (!queue || !queue.isPlaying()) {
      return interaction.reply({ content: '❌ Não há música tocando no momento.', ephemeral: true });
    }

    let repeatMode;
    if (mode === 'off') repeatMode = QueueRepeatMode.OFF;
    if (mode === 'track') repeatMode = QueueRepeatMode.TRACK;
    if (mode === 'queue') repeatMode = QueueRepeatMode.QUEUE;

    queue.setRepeatMode(repeatMode);

    return interaction.reply(`🔁 Modo de repetição definido para **${mode}**.`);
  }
};
