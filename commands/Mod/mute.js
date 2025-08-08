const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('mute')
    .setDescription('🔇 Silencia um usuário por um tempo')
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
    .addUserOption(option =>
      option.setName('usuário')
        .setDescription('Usuário para silenciar')
        .setRequired(true)
    )
    .addIntegerOption(option =>
      option.setName('tempo')
        .setDescription('Tempo em minutos para silenciar (máx 60 minutos)')
        .setRequired(true)
        .setMinValue(1)
        .setMaxValue(60)
    )
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo do silêncio')
        .setRequired(false)
    ),

  category: "Moderation",

  async execute(interaction) {
    if (!interaction.member.permissions.has('ModerateMembers'))
      return interaction.reply({ content: '❌ Você não tem permissão para silenciar membros.', flags: 64 });

    const user = interaction.options.getUser('usuário');
    const tempo = interaction.options.getInteger('tempo');
    const motivo = interaction.options.getString('motivo') || 'Não especificado';

    const member = interaction.guild.members.cache.get(user.id);
    if (!member) return interaction.reply({ content: '❌ Usuário não encontrado no servidor.', flags: 64 });
    if (!member.moderatable) return interaction.reply({ content: '❌ Não posso silenciar este usuário.', flags: 64 });

    try {
      const muteTimeMs = tempo * 60 * 1000;
      await member.timeout(muteTimeMs, motivo);

      const embed = new EmbedBuilder()
        .setTitle('🔇 Usuário silenciado')
        .setColor(YUKI_COLOR)
        .setDescription(`Usuário ${user.tag} foi silenciado por ${tempo} minutos.\n**Motivo:** ${motivo}`)
        .setTimestamp()
        .setFooter({ text: '🌸 Yuki', iconURL: interaction.client.user.displayAvatarURL() });

      interaction.reply({ embeds: [embed] });
    } catch {
      interaction.reply({ content: '❌ Ocorreu um erro ao tentar silenciar o usuário.', flags: 64 });
    }
  }
};
