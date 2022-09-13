const { EmbedBuilder, ButtonStyle, SlashCommandBuilder, ChatInputCommandInteraction, Client } = require('discord.js')
const Pagination = require('customizable-discordjs-pagination');
module.exports = {
    category: 'Moderación',
    onlyDeveloper: false,
    createdAt: '‎02/09/2022',
    data: new SlashCommandBuilder()
    .setName('warns')
    .setDescription('Mira las advertencias de un usuario.')
        .addUserOption(u => u
            .setName('usuario')
            .setDescription('Ingresa el usuario para ver sus advertencias.')
            .setRequired(true)
            ),
    /**
     * 
     * @param {ChatInputCommandInteraction} interaction 
     * @param {Client} client 
     */
    async execute(interaction, client) {

        const warns = require('../Schemas/warns.js');
        const user = interaction.options.getMember('usuario');
        const usuario = interaction.options.getUser('usuario');

        if(!interaction.member.permissions.has('moderate_members')) return interaction.reply({embeds: [new EmbedBuilder()
            .setDescription('❌ No tienes permisos de: `Moderar usuarios`.')
            .setColor(client.config.errorColor)
            ], ephemeral: true })

        if(user.bot) return interaction.reply({embeds: [new EmbedBuilder()
            .setDescription('❌ No puedes ver las advertencias de un bot.')
            .setColor(client.config.errorColor)
            ], ephemeral: true })

       if(interaction.member.roles.highest.comparePositionTo(user.roles.highest) < 0) return interaction.reply({embeds: [new EmbedBuilder()
        .setDescription('❌ No puedes ver las advertencias de un usuario superior a ti.')
        .setColor(client.config.errorColor)
        ], ephemeral: true })

        const data = await warns.find({
            UserID: user.user.id,
            GuildID: interaction.guild.id
        });

        const embeds = [];

        if(data.length === 0) {
        const embed = new EmbedBuilder()
        .setTitle(`Warns de ${usuario.username}`)
        .addFields([{ name: '`⚠` Warns:', value: `Ninguno` }])
        .setColor(client.config.successColor)
        .setTimestamp()
        .setFooter({text: `Comando requerido por: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
        .setThumbnail(interaction.user.displayAvatarURL())
        return interaction.reply({
            embeds: [embed]
        })
        }

        for(const warn of data.sort((a, b) => b.date - a.date)) {
            const embed = new EmbedBuilder()
        .setTitle(`Lista de warns de ${usuario.username}`)
        .setDescription(`Cantidad de warns: ${data.length}`)
        .addFields([{ name: '`👮` Moderador:', value: `<@${warn.ModeratorID}>` }])
        .addFields([{ name: '`✍️` Razon:', value: `${warn.Reason}` }])
        .addFields([{ name: '`🆔` ID del warn:', value: `${warn.Id}` }])
        .addFields([{ name: '`📆` Fecha:', value: `<t:${Math.floor(warn.Date / 1000)}:F>` }])
        .setColor(client.config.infoColor)
        .setTimestamp()
        .setFooter({text: `Comando requerido por: ${interaction.user.username}`, iconURL: interaction.user.displayAvatarURL()})
        .setThumbnail(interaction.user.displayAvatarURL())
        embeds.push(embed)
        }

        // sendPaginatedEmbeds(interaction, embeds, {
        //     style: 'SECONDARY',
        //     previousLabel: 'Pagina anterior',
        //     nextLabel: 'Siguiente pagina'
        // });

const buttons = [
   { label: 'Anterior', emoji: '⬅', style: ButtonStyle.Danger },
   { label: 'Siguiente', emoji: '➡', style: ButtonStyle.Success },
]

new Pagination()
   .setCommand(interaction)
   .setPages(embeds)
   .setButtons(buttons)
   .setFooter({
    extraText: `Comando requerido por: ${interaction.user.username}` 
   })
   .send();

    },
};
