# Importante
## Este proyecto, tendrás que cambiarlo dependiendo de tu handler de comands, events, etc. Esto solamente es una especie de plantilla para guiarte a hacer tus sistemas

Ejemplo de algún comando usando MI HANDLER:
```js
const {Client, EmbedBuilder, SlashCommandBuilder } = require("discord.js");
module.exports = {
  category: "Util",
  createdAt: "13/09/2022",
  data: new SlashCommandBuilder()
  .setName("ping")
  .setDescription("PONG"),
/**
* @param {Interaction} interaction
* @param {Client} client
*/
async execute(interaction, client) {
  
    interaction.reply({
      content: "¡Pong!",
      embeds: [new EmbedBuilder().setDescription(`${client.ws.ping}ms`)],
      ephemera: true
    })
    
  },
};
```

## Este repositorio está hecho en discord.js v14
