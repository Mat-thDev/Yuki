const { Events, PermissionsBitField, EmbedBuilder } = require('discord.js');
const client = require('../../yuki')

module.exports = {
  name: 'interactionCreate',
};

client.on(Events.InteractionCreate, async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  const command = interaction.client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    if (command.guild_member_permissions?.length > 0) {
      const missing = command.guild_member_permissions.filter(
        (perm) => !interaction.member.permissions.has(perm)
      );

      if (missing.length > 0) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`🚫 Você não tem permissão para usar este comando.`)
              .setColor('Red'),
          ],
          flags: 64,
        });
      }
    }

    if (command.guild_client_permissions?.length > 0) {
      const botMember = interaction.guild.members.me;
      const missing = command.guild_client_permissions.filter(
        (perm) => !botMember.permissions.has(perm)
      );

      if (missing.length > 0) {
        return interaction.reply({
          embeds: [
            new EmbedBuilder()
              .setDescription(`🚫 Eu não tenho permissão para executar este comando.`)
              .setFooter({
                text: `Permissões necessárias: ${missing.join(', ')}`,
              })
              .setColor('Red'),
          ],
          flags: 64,
        });
      }
    }

    await command.execute(interaction, client);
  } catch (err) {
    console.error(`[ERRO] Falha ao executar o comando ${interaction.commandName}:`, err);

    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: '❌ Ocorreu um erro ao executar o comando.',
        flags: 64,
      });
    } else {
      await interaction.reply({
        content: '❌ Ocorreu um erro ao executar o comando.',
        flags: 64,
      });
    }
  }
});
