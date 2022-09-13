const { EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js')
const {Generator} = require('randomly-id-generator')
module.exports = {
category: 'Moderación',
onlyDeveloper: false,
createdAt: '‎02/09/2022',
data: new SlashCommandBuilder()
.setName('unwarn')
.setDescription('Elimina una advertencia.')
.addSubcommand((scmd) => scmd
    .setName('identificador')
    .setDescription('Elimina una advertencia por el ID.')
    .addStringOption((u) => u
        .setName('id')
        .setDescription('Ingresa el ID de warn para eliminar.')
        .setRequired(true)
        ))
.addSubcommand((scmd) => scmd
    .setName('all')
    .setDescription('Elimina todas las advertencias de un usuario.')
    .addUserOption((user) => user
        .setName('usuario')
        .setDescription('Ingresa el usuario para eliminar todas sus advertencias.')
        .setRequired(true))
    ),
/**
 * 
 * @param {ChatInputCommandInteraction} interaction 
 * @param {Client} client 
 */
async execute(interaction, client) {

    const warns = require('../Schemas/warns.js');

    const Sub = interaction.options.getSubcommand()

       if(Sub == 'identificador') {

    const id = interaction.options.getString('id');
    const data = await warns.findOne({
        id: id,
        GuildID: interaction.guild.id
    })

    const user = await interaction.guild.members.fetch(data.UserID)
    if(!user) return interaction.reply({embeds: [new EmbedBuilder()
        .setDescription('❌ El usuario con esta ID no se encuentra en este servidor.')
        .setColor(client.config.errorColor)
        ], ephemeral: true })

    if(!data) return interaction.reply({embeds: [new EmbedBuilder()
        .setDescription('❌ No hay ninguna advertencia enlazada a este ID.')
        .setColor(client.config.errorColor)
        ], ephemeral: true })

    if(!interaction.member.permissions.has('moderate_members')) return interaction.reply({embeds: [new EmbedBuilder()
        .setDescription('❌ No tienes permisos de: `Moderar usuarios`.')
        .setColor(client.config.errorColor)
        ], ephemeral: true })

    if(user === interaction.user) return interaction.reply({embeds: [new EmbedBuilder()
        .setDescription('❌ No puedes quitarte una advertencia a ti mismo a ti mismo.')
        .setColor(client.config.errorColor)
        ], ephemeral: true })

    if(user.bot) return interaction.reply({embeds: [new EmbedBuilder()
        .setDescription('❌ No puedes quitar advertencias a un bot.')
        .setColor(client.config.errorColor)
        ], ephemeral: true })

   if(interaction.member.roles.highest.comparePositionTo(user.roles.highest) < 0) return interaction.reply({embeds: [new EmbedBuilder()
    .setDescription('❌ No puedes quitarle una advertencia a un usuario superior a ti.')
    .setColor(client.config.errorColor)
    ], ephemeral: true })



    const embed = new EmbedBuilder()
    .setTitle(`Advertencia removida`)
    .setDescription(`Advertencia de ${user.toString()} con ID **${id.toString()}**`)

    .setColor(client.config.successColor)
    .setTimestamp()
    .setFooter({text: `Comando requerido por: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
    .setThumbnail(interaction.user.displayAvatarURL())

    data.delete()

    return interaction.reply({
        embeds: [embed]
    })
    } 

    if(Sub == 'all') {
    const member = interaction.options.getMember('usuario')

    if(!interaction.member.permissions.has('moderate_members')) return interaction.reply({embeds: [new EmbedBuilder()
        .setDescription('❌ No tienes permisos de: `Moderar usuarios`.')
        .setColor(client.config.errorColor)
        ], ephemeral: true })

    if(member === interaction.user) return interaction.reply({embeds: [new EmbedBuilder()
        .setDescription('❌ No puedes quitarte una advertencia a ti mismo a ti mismo.')
        .setColor(client.config.errorColor)
        ], ephemeral: true })

    if(member.bot) return interaction.reply({embeds: [new EmbedBuilder()
        .setDescription('❌ No puedes quitar advertencias a un bot.')
        .setColor(client.config.errorColor)
        ], ephemeral: true })

   if(interaction.member.roles.highest.comparePositionTo(member.roles.highest) < 0) return interaction.reply({embeds: [new EmbedBuilder()
    .setDescription('❌ No puedes quitarle una advertencia a un usuario superior a ti.')
    .setColor(client.config.errorColor)
    ], ephemeral: true })

    const data = await warns.find({
        GuildID: interaction.guild.id,
        UserID: member.user.id
    })

    if(data.length === 0) return interaction.reply({embeds: [new EmbedBuilder()
    .setDescription('❌ Este usuario no tiene advertencias.')
    .setColor(client.config.errorColor)
    ], ephemeral: true })

        for(const warn of data) {
            warn.delete()
        }

    const embed = new EmbedBuilder()
    .setTitle(`Todas las advertencias eliminadas`)
    .setDescription(`Se borraron todas las advertencias de ${member.toString()}. En total se ${data.length > 1? 'borraron' : 'borró'} \`${data.length}\` ${data.length > 1? 'adveretencias' : 'advertencia'}.`)

    .setColor(client.config.successColor)
    .setTimestamp()
    .setFooter({text: `Comando requerido por: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
    .setThumbnail(interaction.user.displayAvatarURL())

    return interaction.reply({
        embeds: [embed]
    })
}

},
};
