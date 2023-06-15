const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const { SlashCommandBuilder } = require('discord.js');
const sheets = require('../sheets.js');

require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(discord_username, email, token) {

	email = email.trim();
	var exp = ''
	var exp = exp.concat('^[a-z]+[0-9]+@',process.env.DOMAIN,'$');
	const regex = new RegExp(exp);
	if (regex.test(email) == false) {
		var prompt = 'Invalid email! Please use your ';
		return prompt.concat(process.env.DOMAIN," email address");
	}

	const [res, errmsg] = await sheets.addUser(discord_username, email, token);

	// 'An error has occurred! Please contact an admin for help';
	if (!res) return `Error: ${errmsg}`;

	const msg = {
		to: email,
		from: process.env.SENDER,
		subject: 'Discord Verification',
		text:`Your token is: ${token}`,
		html: `Your token is: ${token}`,
	};

	try {
		const response = await sgMail.send(msg);
		if (response[0].statusCode == 202) {
			return 'Email sent!';
		}
		else {
			console.log(`An error occurred sending email to ${email}!`);
			return 'An error has occured! Please contact an admin for help';
		}
	}
	catch (error) {
		console.log(error);
		return 'A fatal error has occurred! Please contact an admin for help';
	}

	// sgMail
	// 	.send(msg)
	// 	.then((response) => {
	// 		console.log(`${response[0].statusCode} ${email} ${token}`);
	// 		if (response[0].statusCode == 202) { return 'Email sent!'; }
	// 		else {
	// 			console.log(`An error occured sending email to ${email}`);
	// 			return 'An error has occured! Please contact an admin for help';
	// 		}
	// 	})
	// 	.catch((error) => {
	// 		console.log(error);
	// 		return 'An error has occured! Please contact an admin for help';
	// 	});
}


module.exports = {
	data: new SlashCommandBuilder()
		.setName('email')
		.setDescription('Sends an email with a secret token')
		.addStringOption(option =>
			option.setName('email')
				.setDescription('Verify your account with your NYU email')
				.setRequired(true)),
	async execute(interaction) {
		const email = interaction.options.getString('email');
		const token = crypto.randomBytes(16).toString('hex');
		const discord_username = interaction.user.id;
		// defer reply so we have up to 15 minutes to respond
		await interaction.deferReply();
		const response = await sendEmail(discord_username, email, token);
		try {
			await interaction.editReply({ content: response, ephemeral: false });
		}
		catch (error) {
			console.log(error);
		}
	},
};

