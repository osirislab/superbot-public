const { SlashCommandBuilder, InviteTargetType, Faces } = require('discord.js');
const sheets = require('../sheets.js');
require('dotenv').config();
async function findIdbyName(iterator,name){
	var   id = NaN;
	for (let key of iterator.keys()) {
		if(iterator.get(key.toString()).name == name)
		{
			id = key;
			break;
		}
	}
	if(id==NaN)
		throw new Error('Failed to fetch');
	else
		return id;
}
async function verify(discord_username, token, interaction) {
	const res 	= await sheets.verifyUser(discord_username, token);
	const id 	= await findIdbyName(await interaction.client.guilds.fetch(),process.env.SERVER_NAME);
	const guild = await interaction.client.guilds.fetch(id);
	const memb 	= await guild.members.fetch(interaction.user.id);
	const role_id = await findIdbyName(await guild.roles.fetch(),process.env.ROLE_NAME)		
	memb.roles.add([role_id]);
	return res.toString();
}
module.exports = {
	data: new SlashCommandBuilder()
		.setName('verify')
		.setDescription('Verify your secret token')
		.addStringOption(option =>
			option.setName('token')
				.setDescription('Verify your account with your school email')
				.setRequired(true)),
	async execute(interaction) {
		const token = interaction.options.getString('token');
		const discord_username = interaction.user.id;
		// just in case if google docs died
		await interaction.deferReply();
		try {
			var res = await verify(discord_username, token, interaction);
			await interaction.editReply({ content: res, ephemeral: false });
		}
		catch (error) {
			console.log(error);
			await interaction.editReply({ content: 'Fatal error while verifying! Please report this to the admin!', ephemeral: false });
		}
		
	},
};
