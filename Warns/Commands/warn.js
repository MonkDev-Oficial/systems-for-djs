const { EmbedBuilder, SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js')
const {Generator} = require('randomly-id-generator')
module.exports = {
    category: 'Moderación',
    onlyDeveloper: false,
    createdAt: '‎02/09/2022',
    data: new SlashCommandBuilder()
    .setName('warn')
    .setDescription('Añade una advertencia a un usuario.')
        .addUserOption(u => u
            .setName('usuario')
            .setDescription('Ingresa el usuario para advertir.')
            .setRequired(true)
            )
        .addStringOption(str => str
            .setName('razon')
            .setDescription('Ingresa una razon para advertir al usuario.')
            .setRequired(false)
            ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const warns = require('../../Structures/Schemas/warns.js');
        const user = interaction.options.getMember('usuario');
        const reason = interaction.options.getString('razon') || 'No fue encontrada.';
        const id = new Generator({ length: 10 }).generate()
        const usuario = interaction.options.getUser('usuario')

        if(!interaction.member.permissions.has('moderate_members')) return interaction.reply({embeds: [new EmbedBuilder()
            .setDescription('❌ No tienes permisos de: `Moderar usuarios`.')
            .setColor(client.config.errorColor)
            ], ephemeral: true })

        if(user === interaction.user) return interaction.reply({embeds: [new EmbedBuilder()
            .setDescription('❌ No puedes advertirte a ti mismo.')
            .setColor(client.config.errorColor)
            ], ephemeral: true })

        if(user.bot) return interaction.reply({embeds: [new EmbedBuilder()
            .setDescription('❌ No puedes advertir a un bot.')
            .setColor(client.config.errorColor)
            ], ephemeral: true })

       if(interaction.member.roles.highest.comparePositionTo(user.roles.highest) < 0) return interaction.reply({embeds: [new EmbedBuilder()
        .setDescription('❌ No puedes advertir a un usuario superior a ti.')
        .setColor(client.config.errorColor)
        ], ephemeral: true })


        await new warns({
            GuildID: interaction.guild.id,
            UserID: user.id,
            Id: id,
            ModeratorID: interaction.user.id,
            Reason: `${reason}`,
            Date: Date.now()
        }).save()

        const embed = new EmbedBuilder()
        .setTitle(`Un usuario ha sido advertido.`)
        .addFields([{ name: '`👥` Usuario:', value: `${usuario.username}` }])
        .addFields([{ name: '`✍️` Razon:', value: `${reason}` }])
        .addFields([{ name: '`👮` Moderador:', value: `${interaction.user.username}` }])
        .addFields([{ name: '`📆` Fecha:', value: `<t:${Math.floor(Date.now() / 1000)}:R>` }])
        .addFields([{ name: '`🆔` ID del warn:', value: `${id}` }])

        .setColor(client.config.successColor)
        .setTimestamp()
        .setFooter({text: `Comando requerido por: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
        .setThumbnail(interaction.user.displayAvatarURL())
        return interaction.reply({
            embeds: [embed]
        })
    
  },
};
