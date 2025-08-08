const { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('avatar')
    .setDescription('📸 Mostra o avatar do usuário em alta qualidade')
    .addUserOption(option =>
      option.setName('usuário')
        .setDescription('Pegar avatar de um membro específico')
        .setRequired(false)
    ),
  category: "Utility",
  
  async execute(interaction, client) {
    const user = interaction.options.getUser('usuário') || interaction.user;

    const avatarPNG = user.displayAvatarURL({ extension: 'png', size: 1024 });
    const avatarJPG = user.displayAvatarURL({ extension: 'jpg', size: 1024 });
    const avatarWEBP = user.displayAvatarURL({ extension: 'webp', size: 1024 });

    const embed = new EmbedBuilder()
      .setColor(YUKI_COLOR)
      .setAuthor({ name: `Avatar de ${user.tag}`, iconURL: user.displayAvatarURL({ size: 256 }) })
      .setImage(user.displayAvatarURL({ size: 1024 }))
      .setFooter({
        text: '🌸 Yuki • Clique nos botões para baixar o avatar',
        iconURL: client.user.displayAvatarURL(),
      })
      .setTimestamp();

    const row = new ActionRowBuilder().addComponents(
      new ButtonBuilder()
        .setLabel('PNG')
        .setStyle(ButtonStyle.Link)
        .setURL(avatarPNG),
      new ButtonBuilder()
        .setLabel('JPG')
        .setStyle(ButtonStyle.Link)
        .setURL(avatarJPG),
      new ButtonBuilder()
        .setLabel('WEBP')
        .setStyle(ButtonStyle.Link)
        .setURL(avatarWEBP)
    );

    await interaction.reply({ embeds: [embed], components: [row] });
  }
};
