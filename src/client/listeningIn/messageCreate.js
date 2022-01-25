const ClientEmbed = require('../../structures/ClientEmbed');
const GetMention = (id) => new RegExp(`^<@!?${id}>( |)$`);
const { WebhookClient } = require("discord.js");
const moment = require("moment");
const coldoown = new Set();
const c = require("colors");
const Emoji = require('../../utils/Emoji');
let t;
  
module.exports = class {
  constructor(client) {
    this.client = client;
  }

  async run(message) {
    if(message.author.bot) return;
    if(!message.guild) return;
    moment.locale("pt-BR");

    try {
      const server = await this.client.database.guilds.findOne({
        idS: message.guild.id,
      });
      let user = await this.client.database.users.findOne({
        idU: message.author.id,
      });
      const client = await this.client.database.clientUtils.findOne({
        _id: this.client.user.id,
      });

      const language = await this.client.getLanguage(message.guild.id);

      try {
        t = await this.client.getTranslate(message.guild.id);
      } catch (e) {
        console.log(e);
      }
      
      if (!user) {
        await this.client.database.users.create({
          idU: message.author.id,
          idS: message.guild.id,
        });
      }

      if (!client)
        await this.client.database.clientUtils.create({
          _id: this.client.user.id,
          reason: "",
          manutenção: false,
        });

      if (!server) {
        if(message.content.match(GetMention(this.client.user.id)) || message.content.includes(prefix)) {
          message.reply({
            embeds: [
              new ClientEmbed(message.author)
              .setDescription(`${Emoji.warning} Olá **${message.author.username}**, eu estou criando um banco de dados para este servidor, por favor utilize o comando novamente!`)
            ]
          })
        }
        return await this.client.database.clientUtils.create({
          idS: message.guild.id
        });
      }

      var prefix =
        server.prefix;

      if (message.content.match(GetMention(this.client.user.id))) {
        return message.reply({
          embeds: [
            new ClientEmbed(message.author)
            .setDescription(`${Emoji.saturn} Olá **${message.author.username}**, use meus comandos em **slash(/)**, se eu não tiver permissão para criar comandos em slash **[Clique Aqui](https://lel.com)**, ou use **${prefix}** para usar meus comandos, está com dúvidas? **[Servidor de Suporte](https://discord.gg/tCjWVspdD7)**!`)
            .setThumbnail(this.client.user.displayAvatarURL({ dynamic: true }))
          ]
        })
      }

      if (message.content.slice(0, prefix.length).toLowerCase() !== prefix) return;
      const author = message.author;
      const args = message.content.slice(prefix.length).trim().split(/ +/g);
      const command = args.shift().toLowerCase();
      const cmd =
        this.client.commands.get(command) ||
        this.client.commands.get(this.client.aliases.get(command));

      if (!cmd) return message.reply({
        content: `**${Emoji.failed} | Algo deu errado ${message.author.username}, este comando \`${command}\` não foi encontrado, use \`${prefix}ajuda\` para ver todos os meus comandos!**`
      });
      if (coldoown.has(message.author.id))
        return message.reply(
          `${message.author}, você deve aguardar **5 segundos** para usar outro comando.`
        );

      const comando = await this.client.database.commands.findOne({
        _id: cmd.name
      });
      if(!comando) {
        await this.client.database.commands.create({
          _id: cmd.name
        })
        return message.reply({
          content: `**${Emoji.failed} | ${message.author.username} algo deu errado ao executar o comando, tente novamente!**`
        }) 
      }

      if (comando) {
        if (message.author.id !== process.env.OWNER_ID) {
          if (comando.manutenção)
            return message.reply(
              `${message.author}, o comando **\`${cmd.name}\`** está em manutenção no momento.\nMotivo: **${comando.reason}**`
            );

          if (client.manutenção) {
            return message.reply(
              `${message.author}, no momento eu me encontro em manutenção, tente novamente mais tarde.\nMotivo: **${client.reason}**`
            );
          }
        }
        if (client.blacklist.some((x) => x == message.author.id)) {
          return message.reply(
            `${message.author}, você não pode me usar no momento. **\`Lista Negra\`**.`
          );
        }

        const cb = server.cmdblock;

        if (cb.status) {
          if (!cb.cmds.some((x) => x === cmd.name)) {
            if (!cb.channels.some((x) => x === message.channel.id)) {
              if (!message.member.permissions.has("MANAGE_MESSAGES")) {
                return message.reply(cb.msg);
              }
            }
          }
        }

        cmd.run({ message, args, prefix, author, language }, t);
        var num = comando.usages;
        num = num + 1;
      } 
    } catch (handlerErr) {
      console.log(handlerErr)
    }
  }
}