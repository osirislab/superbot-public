const crypto = require('crypto');
const sgMail = require('@sendgrid/mail');
const { SlashCommandBuilder } = require('discord.js');
const sheets = require('../sheets.js');

require('dotenv').config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

async function sendEmail(discord_username, email, token) {

	// if (email.endsWith('@nyu.edu') == false) {
	// 	return 'Please use your NYU email address!';
	// }

	// trim the email of white spaces just in case.
	email = email.trim();

	// Match the beginning and end of the string, n-alphabet n-number @nyu.edu
	const regex = new RegExp('^[a-z]+[0-9]+@nyu.edu$');
	if (regex.test(email) == false) {
		return 'Invalid email! Please use your NYU email address with the format NETID@nyu.edu';
	}

	const [res, errmsg] = await sheets.addUser(discord_username, email, token);

	// 'An error has occurred! Please contact an admin for help';
	if (!res) return `Error: ${errmsg}`;

	const msg = {
		to: email,
		from: process.env.SENDER,
		subject: 'OSIRIS Lab Verification',
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

