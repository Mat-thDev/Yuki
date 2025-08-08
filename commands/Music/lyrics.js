const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

const { getLyrics } = require('genius-lyrics-api');

const { useMainPlayer } = require('discord-player');

const { YUKI_COLOR, GENIUS_ACCESS_TOKEN} = process.env;


module.exports = {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setDescription('🎤 Mostra a letra da música atual ou de uma música específica')
    .addStringOption(option =>
      option.setName('query')
        .setDescription('Nome da música para buscar a letra (opcional)')
        .setRequired(false)
    ),
  category: "Music",
  async execute(interaction) {
    await interaction.deferReply();

    const query = interaction.options.getString('query');
    const player = useMainPlayer();
    const queue = player.nodes.get(interaction.guild);

    let searchTerm = query;

    if (!searchTerm) {
      if (!queue || !queue.isPlaying()) {
        return interaction.editReply('❌ Nenhuma música está tocando e nenhum termo foi fornecido.');
      }
      searchTerm = queue.currentTrack.title;
    }

    try {

      const options = {
        apiKey: GENIUS_ACCESS_TOKEN,
        title: searchTerm,  
        artist: queue.currentTrack.author,
        optimizeQuery: true
      };
    
      const lyrics = await getLyrics(options) || "🎵 Letra não encontrada.";

      const description = lyrics.length > 4096 ? lyrics.slice(0, 4093) + '...' : lyrics;

      const embed = new EmbedBuilder()
        .setColor(YUKI_COLOR)
        .setTitle(`🎶 Letra: ${searchTerm}`)
        .setDescription(description)
        .setFooter({ text: '🌸 Yuki', iconURL: interaction.client.user.displayAvatarURL() })
        .setTimestamp();

      return interaction.editReply({ embeds: [embed] });
    } catch (error) {
      console.error(error);
      return interaction.editReply('❌ Ocorreu um erro ao buscar a letra.');
    }
  }
};
