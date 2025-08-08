const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { YUKI_COLOR } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setDescription('📊 Mostra informações detalhadas do servidor'),
  category: "Utility",
  
  async execute(interaction, client) {
    const guild = interaction.guild;

    const owner = await guild.fetchOwner();

    const embed = new EmbedBuilder()
      .setColor(YUKI_COLOR)
      .setTitle(`Informações do servidor: ${guild.name}`)
      .setThumbnail(guild.iconURL({ dynamic: true, size: 256 }))
      .addFields(
        { name: '🆔 ID do Servidor', value: guild.id, inline: true },
        { name: '👑 Dono', value: `${owner.user.tag}`, inline: true },
        { name: '📅 Criado em', value: `<t:${Math.floor(guild.createdTimestamp / 1000)}:D>`, inline: true },
        { name: '👥 Membros', value: `${guild.memberCount}`, inline: true },
        { name: '🟢 Online', value: `${guild.presences.cache.filter(p => p.status === 'online').size}`, inline: true },
        { name: '📚 Canais', value: `${guild.channels.cache.size}`, inline: true },
        { name: '🎭 Roles', value: `${guild.roles.cache.size}`, inline: true },
        { name: '💎 Boosts', value: `${guild.premiumSubscriptionCount} (Nível ${guild.premiumTier})`, inline: true }
      )
      .setFooter({ text: '🌸 Yuki', iconURL: client.user.displayAvatarURL() })
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  }
};
