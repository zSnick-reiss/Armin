const Discord = require("discord.js");
const ClientEmbed = require("../../structures/ClientEmbed");
const { MessageActionRow, MessageSelectMenu } = require("discord.js");
const Command = require("../../structures/Command");

module.exports = class Menu extends Command {
    constructor(client) {
       super(client);
       this.client = client;

       this.name = "menu",
       this.category = "Information",
       this.description = "",
       this.usage = "",
       this.aliases = ["menu"]

       this.enabled = true;
       this.guildOnly = true;
}
async run({ message, args, author }, t) {

  let painel = new MessageActionRow()
    .addComponents(
      new MessageSelectMenu()
        .setCustomId("menu")
        .setPlaceholder("Clique Aki")
        .addOptions([
          {
            label: `Painel`,
            description: `Painel Inicial`,
            emoji: `🏘️`,
            value: `1`
          },
          {
            label: `Pag 2`,
            description: `página 2`,
            emoji: `📄`,
            value: `2`
          }
        ])
    )

  message.reply({
    embeds: [
      new Discord.MessageEmbed({
        title: "PAG 1"
      })
    ],
    components: [painel]
  }).then(msg => {
    const filtro = (interaction) => interaction.isSelectMenu()

    const coletor = msg.createMessageComponentCollector({
      filter: filtro
    })
   
    coletor.on("collect", async (collected) => {
      let valor = collected.values[0]
      collected.deferUpdate()

      if (valor === "1") {
     
        msg.edit({
          embeds: [
            new Discord.MessageEmbed({
              title: "PAG 1"
            })
          ],
          components: [painel]
        })
      }

      if (valor === "2") {

        msg.edit({
          embeds: [
            new Discord.MessageEmbed({
              title: "PAG 2"
            })
          ],
          components: [painel]
        })
      }
    })
  })
}
} 
