const { Events } = require('discord.js');
const { default: chalk } = require("chalk");
const db = require("../../utils/database");
const client = require("../../yuki");

module.exports = {
  name: 'onMemberEnter',
};

client.on(Events.GuildMemberAdd, async (member) => {
  console.log(`Novo membro entrou: ${chalk.green(member.user.tag)} - Servidor: ${chalk.green(member.guild.name)}`);
  await handleAutoRole(member);
});

const handleAutoRole = async (member) => {
  const config = db.prepare("SELECT role_id FROM autorole WHERE guild_id = ?").get(member.guild.id);
  if (!config) return;

  const role = member.guild.roles.cache.get(config.role_id);
  if (!role) {
    console.warn(chalk.yellow(`Cargo com ID ${config.role_id} não encontrado.`));
    return;
  }

  try {
    await member.roles.add(role);
    console.log(chalk.blue(`Cargo ${role.name} adicionado ao membro ${member.user.tag}`));
  } catch (err) {
    console.error(chalk.red("Erro ao adicionar cargo automaticamente:"), err);
  }
};
