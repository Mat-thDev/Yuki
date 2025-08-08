const fs = require("fs");
const { default: chalk } = require("chalk");

module.exports = (client) => {
  console.log(chalk.blue("0------------------| Event Handler:"));
  
  fs.readdirSync('./events/').forEach(dir => {
    const commands = fs.readdirSync(`./events/${dir}`).filter(file => file.endsWith('.js'));
    for (let file of commands) {
      let pull = require(`../events/${dir}/${file}`);
      if (pull.name) {
        client.events.set(pull.name, pull);
        console.log(chalk.greenBright(`[HANDLER - EVENT] Arquivo carregado: ${pull.name}`))
      } else {
        console.log(chalk.red(`[HANDLER - EVENT] Não foi possível carregar o arquivo ${file}.`))
        continue;
      }
      
    }
  });
}