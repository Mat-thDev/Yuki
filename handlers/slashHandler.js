const { Routes, REST } = require('discord.js');
const fs = require("fs");
const { default: chalk } = require("chalk");

const { YUKI_CLIENTID, YUKI_TOKEN, GUILD_ID } = process.env

module.exports = (client) => {
    console.log(chalk.blue("0------------------| Command Handler:"))
    
    const commands = [];

    fs.readdirSync('./commands/').forEach(dir => {
        const cmds = fs.readdirSync(`./commands/${dir}`).filter(file => file.endsWith('.js'));

        for (let file of cmds) {
            let pull = require(`../commands/${dir}/${file}`);

            if('data' in pull && 'execute' in pull) {
                client.commands.set(pull.data.name, pull);
                console.log(chalk.greenBright(`[HANDLER - COMMANDOS] Arquivo carregado: ${pull.data.name} (#${client.commands.size})`));

                commands.push(pull.data.toJSON())
            } else {
                console.log(chalk.red(`[HANDLER - COMMANDOS] Não foi possível carregar o arquivo ${file}.`))
                continue;
            }
        }
    })

    if(!YUKI_CLIENTID) {
        console.log(chalk.red("[CRASH] Você precisa providenciar o id do bot!" + "\n"));
        return process.exit()
    }

    const rest = new REST().setToken(YUKI_TOKEN);

    (async() => {
        try {
            await rest.put(
                Routes.applicationGuildCommands(YUKI_CLIENTID, GUILD_ID),
                // Routes.applicationCommands(YUKI_CLIENTID),
                { body: commands }
            );

            console.log(chalk.greenBright(`[AVISO - COMMANDOS] Comandos em barra foram registrados com sucesso.` + "\n"));
        } catch (err) {
            console.log(err);
        }
    })();

}