const { MessageEmbed, Permissions, Client } = require('discord.js');
const Guild = require('../models/guild');
const moment = require('moment');
module.exports = {
	name: "userinfo",
	description: "Pain",
	run: async (client, message, args) => {
		const gSettings = await Guild.findOne({
			guildID: message.guild.id
		})
		let user = message.mentions.members.first() || message.guild.members.cache.get(args[1]);

		if (!args[1]) {
			const userInfoAuthor = new MessageEmbed()
				.setAuthor(`${message.author.username}`, message.author.avatarURL({ dynamic: true }))
				.setThumbnail(message.author.displayAvatarURL({ dynamic: true }))
				.setColor(gSettings.color)
				.addField("User Name:", `\`${message.author.tag}\``, true)
				.addField("User ID", `\`${message.author.id}\``, true)
				.addField('Account joined:', `\`${moment(message.member.joinedAt).format('MMMM-DD-YYYY')}\``, false)
				.addField('Account Created:', `\`${moment(message.author.createdAt).format('MMMM-DD-YYYY')}\``, true)
				.addField("Highest Role:", `${message.member.roles.highest}`, true)
				.setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
			if (message.member.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
				if (message.member.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
					userInfoAuthor.addField("Dangerous Permissions:", "`MANAGE_GUILD`, `ADMINISTRATOR`")
				} else {
					userInfoAuthor.addField("Dangerous Permissions:", "`MANAGE_GUILD`")
				}
			}
			return message.channel.send({ embeds: [userInfoAuthor] })
		}
		if (!user) { return message.channel.send("Invalid User"); }
		const userInfoUser = new MessageEmbed()
			.setAuthor(`${user.user.tag}`, user.user.displayAvatarURL({ dynamic: true }))
			.setThumbnail(user.user.displayAvatarURL({ dynamic: true }))
			.setColor(gSettings.color)
			.addField("User Name:", `<@${user.id}>`, true)
			.addField("User ID", `\`${user.id}\``, true)
			.addField('Account joined:', `\`${moment(user.joinedAt).format('MMMM-DD-YYYY')}\``, false)
			.addField('Account Created:', `\`${moment(user.user.createdAt).format('MMMM-DD-YYYY')}\``, true)
			.addField("Highest Role:", `${user.roles.highest}`, true)
			.setFooter(`Requested by ${message.author.tag}`, message.author.avatarURL({ dynamic: true }))
		if (user.permissions.has(Permissions.FLAGS.MANAGE_GUILD)) {
			if (user.permissions.has(Permissions.FLAGS.ADMINISTRATOR)) {
				userInfoUser.addField("Dangerous Permissions:", "`MANAGE_GUILD`, `ADMINISTRATOR`")
			} else {
				userInfoUser.addField("Dangerous Permissions:", "`MANAGE_GUILD`")
			}
		}
		message.channel.send({ embeds: [userInfoUser] })
	}
}