const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');
const { YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('unmute')
    .setDescription('🔈 Remove o silêncio de um usuário')
    .setDefaultMemberPermissions(PermissionFlagsBits.MuteMembers)
    .addUserOption(option =>
      option.setName('usuário')
        .setDescription('Usuário para desmutar')
        .setRequired(true)
    )
    .addStringOption(option =>
      option.setName('motivo')
        .setDescription('Motivo para remover o silêncio')
        .setRequired(false)
    ),
  category: "Moderation",
  async execute(interaction) {
    if (!interaction.member.permissions.has('ModerateMembers'))
      return interaction.reply({ content: '❌ Você não tem permissão para desmutar membros.', flags: 64 });

    const user = interaction.options.getUser('usuário');
    const motivo = interaction.options.getString('motivo') || 'Não especificado';

    const member = interaction.guild.members.cache.get(user.id);
    if (!member) return interaction.reply({ content: '❌ Usuário não encontrado no servidor.', flags: 64 });
    if (!member.moderatable) return interaction.reply({ content: '❌ Não posso desmutar este usuário.', flags: 64 });

    try {
      await member.timeout(null, motivo);

      const embed = new EmbedBuilder()
        .setTitle('🔈 Usuário desmutado')
        .setColor(YUKI_COLOR)
        .setDescription(`Usuário ${user.tag} teve o silêncio removido.\n**Motivo:** ${motivo}`)
        .setTimestamp()
        .setFooter({ text: '🌸 Yuki', iconURL: interaction.client.user.displayAvatarURL() });

      interaction.reply({ embeds: [embed] });
    } catch {
      interaction.reply({ content: '❌ Ocorreu um erro ao tentar desmutar o usuário.', flags: 64 });
    }
  }
};
