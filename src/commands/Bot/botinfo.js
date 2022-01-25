const User = require("../../database/Schemas/User");
const Command = require("../../structures/Command");
const ClientEmbed = require("../../structures/ClientEmbed");
const moment = require("moment");
const Discord = require("discord.js");
require("moment-duration-format");

module.exports = class BotInfo extends Command {
  constructor(client) {
    super(client);
    this.client = client;

    this.name = "botinfo";
    this.category = "Bot";
    this.description = "Comando para olhar as informações do Bot.";
    this.usage = "botinfo";
    this.aliases = ["b-info", "bi"];

    this.enabled = true;
    this.guildOnly = true;
  }

  async run({ message, args, prefix, author }, t) {
    //===============> Imports <===============//
    const guilds = await this.client.shard.broadcastEval(
        () => this.guilds.cache.size
      ),
      users = await this.client.shard.broadcastEval(
        () => this.users.cache.size
      );
    const botGuilds = guilds.reduce((prev, val) => prev + val),
      botUsers = users.reduce((prev, val) => prev + val),
      commands = this.client.commands.size;
    const uptime = moment
      .duration(process.uptime() * 1000)
      .format("d[d] h[h] m[m] e s[s]");
    const memory =
      (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2) + "MB";
    const ping = Math.ceil(this.client.ws.ping) + "ms";
    const version = process.version;
    const owner = await this.client.users.fetch(process.env.OWNER_ID);

    //===============> Start Request DB <===============//

    const startDB = process.hrtime();
    User.findOne({ idU: message.author.id }, async (err, user) => {
      const coins = user.coins;
    });

    //===============> Finish Request DB <===============//

    const stopDB = process.hrtime(startDB);
    const pingDB = Math.round((stopDB[0] * 1e9 + stopDB[1]) / 1e6) + "ms";

    //===============> Finish <===============//

    const EMBED = new ClientEmbed(author)

      .setAuthor({
        name: `Minhas Informações`,
        iconURL: this.client.user.displayAvatarURL()
      })
      .addFields(
        {
          name: "Meu Dono",
          value: `**${owner.tag}** || **[${owner.username}](https://github.com/zSpl1nterUS)**`,
        },
        {
          name: `Informações Principais`,
          value: `Usuários do Bot: **${botUsers}**\nServidores do Bot: **${botGuilds}**\nTotal de Comandos: **${commands}**\nTempo Online: **\`${uptime}\`**`,
        },
        {
          name: `Mais Informações`,
          value: `Ping do Bot: **${ping}**\nPing da DataBase: **${pingDB}**\nTotal de Memória sendo Usado: **${memory}**\nVersão do Node: **${version}**`,
        },
        {
          name: `Meus Links`,
          value: `[Meu Convite](https://discord.com/oauth2/authorize?client_id=788317008050782239&permissions=20887631278&scope=bot)\n[Servidor de Suporte](https://discord.gg/zX8Fq4V)`,
        }
      )
      .setThumbnail(
        this.client.user.displayAvatarURL({ format: "jpg", size: 2048 })
      );

    message.reply({ embeds: [EMBED] });
  }
};
