const { SlashCommandBuilder, EmbedBuilder, MessageCollector } = require('discord.js');
const { stripIndents } = require('common-tags');
const words = require('../../assets/words.json');

const { YUKI_COLOR } = process.env;

const activeGames = new Map();

module.exports = {
  data: new SlashCommandBuilder()
    .setName('forca')
    .setDescription('🎮 Jogo da Forca: tente acertar a palavra!'),

  category: "Games",

  async execute(interaction) {
    const guildId = interaction.guildId;
    if (activeGames.has(guildId)) {
      return interaction.reply({ content: '🚫 Já existe uma partida rodando neste servidor!', ephemeral: true });
    }

    activeGames.set(guildId, true);

    try {
      await interaction.deferReply();

      const word = words[Math.floor(Math.random() * words.length)].toLowerCase();
      console.log(`[Forca] Palavra sorteada: ${word}`);

      let points = 0;
      let display = Array(word.length).fill('⬜');
      let guessedLetters = new Set();
      let incorrectLetters = new Set();

      const filter = m => 
        m.author.id === interaction.user.id &&
        /^[a-zA-ZÀ-ú]{1,}$/.test(m.content) && 
        !guessedLetters.has(m.content.toLowerCase()) &&
        !incorrectLetters.has(m.content.toLowerCase());

      const collector = new MessageCollector(interaction.channel, { filter, time: 120_000 }); // 2 min

      const updateEmbed = () => {
        const hangmanVisual = stripIndents`
          \`\`\`
          ___________
          |     |
          |     ${points > 0 ? 'O' : ' '}
          |    ${points > 2 ? '—' : ' '}${points > 1 ? '|' : ' '}${points > 3 ? '—' : ' '}
          |    ${points > 4 ? '/' : ' '} ${points > 5 ? '\\' : ' '}
          ===========
          \`\`\`
        `;

        return new EmbedBuilder()
          .setTitle('🎮 Jogo da Forca')
          .setDescription(stripIndents`
            Palavra: ${display.join(' ')}
            Letras incorretas: ${[...incorrectLetters].join(', ') || 'Nenhuma'}
            Tentativas restantes: ${6 - points}
            
            ${hangmanVisual}
          `)
          .setColor(YUKI_COLOR)
          .setFooter({ text: `Jogando: ${interaction.user.tag} | Diga "cancelar" para sair`, iconURL: interaction.user.displayAvatarURL() })
          .setTimestamp();
      };

      await interaction.editReply({ embeds: [updateEmbed()] });

      collector.on('collect', async msg => {
        const guess = msg.content.toLowerCase();

        if (guess === 'cancelar') {
          collector.stop('cancel');
          return;
        }

        if (guess.length > 1) {
          if (guess === word) {
            display = word.split('');
            collector.stop('win');
            return;
          } else {
            points++;
            incorrectLetters.add(guess);
          }
        } else {
          if (word.includes(guess)) {
            guessedLetters.add(guess);
            for (let i = 0; i < word.length; i++) {
              if (word[i] === guess) display[i] = guess;
            }
          } else {
            points++;
            incorrectLetters.add(guess);
          }
        }

        if (!display.includes('⬜')) {
          collector.stop('win');
          return;
        }

        if (points >= 6) {
          collector.stop('lose');
          return;
        }

        await interaction.editReply({ embeds: [updateEmbed()] });
      });

      collector.on('end', async (_, reason) => {
        activeGames.delete(guildId);

        let finalEmbed;

        if (reason === 'win') {
          finalEmbed = new EmbedBuilder()
            .setTitle('🎉 Você venceu!')
            .setDescription(`Parabéns, você acertou a palavra: **${word}**`)
            .setColor('Green')
            .setTimestamp();
        } else if (reason === 'lose') {
          finalEmbed = new EmbedBuilder()
            .setTitle('💀 Você perdeu!')
            .setDescription(`A palavra correta era: **${word}**`)
            .setColor('Red')
            .setTimestamp();
        } else if (reason === 'cancel') {
          finalEmbed = new EmbedBuilder()
            .setTitle('❌ Jogo cancelado')
            .setDescription('O jogo da forca foi cancelado.')
            .setColor('Yellow')
            .setTimestamp();
        } else {
          finalEmbed = new EmbedBuilder()
            .setTitle('⌛ Tempo esgotado')
            .setDescription(`Você não respondeu a tempo. A palavra era: **${word}**`)
            .setColor('Orange')
            .setTimestamp();
        }

        await interaction.editReply({ embeds: [finalEmbed] });
      });

    } catch (error) {
      console.error(error);
      activeGames.delete(guildId);
      return interaction.editReply({ content: '❌ Ocorreu um erro inesperado durante o jogo.' });
    }
  }
};
