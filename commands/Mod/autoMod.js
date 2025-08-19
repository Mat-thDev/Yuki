
const { SlashCommandBuilder, PermissionFlagsBits } = require("discord.js");
const db = require("../../utils/database");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("automod")
    .setDescription("🤖 Gerencie a função de auto moderação.")
    .setDefaultMemberPermissions(PermissionFlagsBits.ModerateMembers)

    // ----------- Blacklist -----------
    .addSubcommandGroup(group =>
      group
        .setName("blacklist")
        .setDescription("Gerencie palavras proibidas do servidor.")
        .addSubcommand(sub =>
          sub
            .setName("add")
            .setDescription("Adicionar uma palavra à blacklist")
            .addStringOption(opt =>
              opt.setName("word").setDescription("Palavra para banir").setRequired(true)
            )
        )
        .addSubcommand(sub =>
          sub
            .setName("remove")
            .setDescription("Remove uma palavra da blacklist")
            .addStringOption(opt =>
              opt.setName("word").setDescription("Palavra para desbanir").setRequired(true)
            )
        )
        .addSubcommand(sub =>
          sub
            .setName("list")
            .setDescription("Mostra todas as palavras banidas no momento.")
        )
    )

    // ----------- Links -----------
    .addSubcommandGroup(group =>
      group
        .setName("links")
        .setDescription("Configura bloqueio de links e convites.")
        .addSubcommand(sub =>
          sub
            .setName("enable")
            .setDescription("Ativa ou desativa o bloqueio de links")
            .addBooleanOption(opt =>
              opt.setName("state").setDescription("true = ativar, false = desativar").setRequired(true)
            )
        )
    )

    // ----------- Spam -----------
    .addSubcommandGroup(group =>
      group
        .setName("spam")
        .setDescription("Configura proteção contra flood de mensagens.")
        .addSubcommand(sub =>
          sub
            .setName("enable")
            .setDescription("Ativa ou desativa a proteção contra spam")
            .addBooleanOption(opt =>
              opt.setName("state").setDescription("true = ativar, false = desativar").setRequired(true)
            )
        )
    )

    // ----------- Capslock -----------
    .addSubcommandGroup(group =>
      group
        .setName("caps")
        .setDescription("Configura limite de letras maiúsculas em mensagens.")
        .addSubcommand(sub =>
          sub
            .setName("enable")
            .setDescription("Ativa ou desativa o bloqueio de CAPS")
            .addBooleanOption(opt =>
              opt.setName("state").setDescription("true = ativar, false = desativar").setRequired(true)
            )
        )
    )

    // ----------- Menções -----------
    .addSubcommandGroup(group =>
      group
        .setName("mentions")
        .setDescription("Configura limite de menções em mensagens.")
        .addSubcommand(sub =>
          sub
            .setName("setlimit")
            .setDescription("Define o limite de menções por mensagem")
            .addIntegerOption(opt =>
              opt.setName("limit").setDescription("Número máximo de menções").setRequired(true)
            )
        )
    )

    // ----------- Emojis -----------
    .addSubcommandGroup(group =>
      group
        .setName("emojis")
        .setDescription("Configura limite de emojis em mensagens.")
        .addSubcommand(sub =>
          sub
            .setName("setlimit")
            .setDescription("Define o limite de emojis por mensagem")
            .addIntegerOption(opt =>
              opt.setName("limit").setDescription("Número máximo de emojis").setRequired(true)
            )
        )
    )

    // ----------- Mensagens Longas -----------
    .addSubcommandGroup(group =>
      group
        .setName("length")
        .setDescription("Configura limite de caracteres em mensagens.")
        .addSubcommand(sub =>
          sub
            .setName("setlimit")
            .setDescription("Define o limite de caracteres por mensagem")
            .addIntegerOption(opt =>
              opt.setName("limit").setDescription("Número máximo de caracteres").setRequired(true)
            )
        )
    ),

  category: "Moderation",

  async execute(interaction) {
    const subcommandGroup = interaction.options.getSubcommandGroup();
    const subcommand = interaction.options.getSubcommand();
    const guildId = interaction.guild.id;

    // ----------- Blacklist -----------
    if (subcommandGroup === "blacklist") return blackListCmd(interaction, subcommand, guildId);

    // ----------- Outros modulos -----------
    if (subcommandGroup === "links" && subcommand === "enable")
      return toggleSetting(interaction, guildId, "links_enabled");

    if (subcommandGroup === "spam" && subcommand === "enable")
      return toggleSetting(interaction, guildId, "spam_enabled");

    if (subcommandGroup === "caps" && subcommand === "enable")
      return toggleSetting(interaction, guildId, "caps_enabled");

    if (subcommandGroup === "mentions" && subcommand === "setlimit") {
      const limit = interaction.options.getInteger("limit");
      return setLimit(interaction, guildId, "mentions_limit", limit);
    }

    if (subcommandGroup === "emojis" && subcommand === "setlimit") {
      const limit = interaction.options.getInteger("limit");
      return setLimit(interaction, guildId, "emojis_limit", limit);
    }

    if (subcommandGroup === "length" && subcommand === "setlimit") {
      const limit = interaction.options.getInteger("limit");
      return setLimit(interaction, guildId, "length_limit", limit);
    }
  },
};

// ----------- Funções Auxiliares -----------
const blackListCmd = async (interaction, command, guildId) => {
  if (!command) return;

  if (command === "add") {
    const word = interaction.options.getString("word").toLowerCase();
    try {
      db.prepare(`INSERT OR IGNORE INTO wordsblacklist (guild_id, word) VALUES (?, ?)`)
        .run(guildId, word);

      await interaction.reply({ content: `✅ Palavra **${word}** adicionada.`, flags: 64 });
    } catch (err) {
      console.error(err);
      await interaction.reply({ content: "❌ Erro ao adicionar a palavra.", flags: 64 });
    }
  }

  if (command === "remove") {
    const word = interaction.options.getString("word").toLowerCase();
    const info = db.prepare(`DELETE FROM wordsblacklist WHERE guild_id = ? AND word = ?`)
      .run(guildId, word);

    if (info.changes > 0) {
      await interaction.reply({ content: `🗑️ Palavra **${word}** removida.`, flags: 64 });
    } else {
      await interaction.reply({ content: `⚠️ Palavra **${word}** não encontrada.`, flags: 64 });
    }
  }

  if (command === "list") {
    const rows = db.prepare(`SELECT word FROM wordsblacklist WHERE guild_id = ?`).all(guildId);
    if (rows.length === 0) {
      await interaction.reply({ content: "📭 Nenhuma palavra na blacklist.", flags: 64 });
    } else {
      const list = rows.map(r => `• ${r.word}`).join("\n");
      await interaction.reply({ content: `📝 **Palavras banidas:**\n${list}`, flags: 64 });
    }
  }
};

const toggleSetting = async (interaction, guildId, column) => {
  const state = interaction.options.getBoolean("state");
  db.prepare(`
    INSERT INTO automod_settings (guild_id, ${column})
    VALUES (?, ?)
    ON CONFLICT(guild_id) DO UPDATE SET ${column} = excluded.${column}
  `).run(guildId, state ? 1 : 0);

  await interaction.reply({
    content: state
      ? `✅ ${column.replace("_", " ")} ativado neste servidor.`
      : `🚫 ${column.replace("_", " ")} desativado neste servidor.`,
    flags: 64
  });
};

const setLimit = async (interaction, guildId, column, value) => {
  db.prepare(`
    INSERT INTO automod_settings (guild_id, ${column})
    VALUES (?, ?)
    ON CONFLICT(guild_id) DO UPDATE SET ${column} = excluded.${column}
  `).run(guildId, value);

  await interaction.reply({
    content: `🔧 Limite de **${column.replace("_", " ")}** definido para **${value}**.`,
    flags: 64
  });
};
