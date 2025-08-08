require("dotenv").config();

const { Client, Events, GatewayIntentBits, Partials, Collection } = require("discord.js")

const { default: chalk } = require("chalk");

const { YUKI_TOKEN } = process.env;

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildVoiceStates,
    ],
    partials: [
        Partials.Channel,
        Partials.Message,
        Partials.User,
        Partials.GuildMember,
        Partials.Reaction
    ],
    presence: {
        activities: [
            {
                name: "Mantendo tudo em ordem",
                type: 3
            }
        ],
        status: 'dnd'
    }
});

// Logged in
client.once(Events.ClientReady, readyClient => {
    console.log(chalk.blue("0------------------| Ready:"))
    console.log(chalk.greenBright(`${readyClient.user.tag} logado com sucesso.`))
});

// Check if the token is valid
if (!YUKI_TOKEN) {
    console.warn(chalk.red("[CRASH] TOKEN AUTH não providenciado ou não é válido.") + "\n")
    process.exit();
};

// Handlers
client.commands = new Collection();
client.events = new Collection();

module.exports = client;

["slashHandler", "eventHandler", "databaseHandler"].forEach(file => {
    require(`./handlers/${file}`)(client);
});

// Logged in and Initialized
client.login(YUKI_TOKEN).catch((err) => {
    console.error(chalk.red("[CRASH] Algo deu errado ao conectar com o bot..." + "\n"));
    console.error(chalk.red("[CRASH] Erro do Discord API:" + err));
    process.exit();
});
