const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./google_creds.json');
require('dotenv').config();


const loadData = async () => {
	try {
		const doc = new GoogleSpreadsheet(process.env.SHEETS_ID);
		await doc.useServiceAccountAuth(creds);
		await doc.loadInfo();
		return doc;
	}
	catch (error) {
		console.log(error);
		return false;
	}
};


const addUser = async (discord, email, token) => {
	try {
		const timestamp = Date().toLocaleString('en-US', { timeZone: 'EST' });

		const doc = await loadData();
		const sheet = doc.sheetsByIndex[0];
		await sheet.loadCells();
		const rows = await sheet.getRows();

		let row;
		// retrieve row if it exists
		for (let i = 0 ; i < rows.length; i += 1) {
			if (rows[i].discord == discord || email == rows[i].email) {
				row = rows[i];
				break;
			}
		}

		if (row) {
			// disallow changes once verified
			if (row.verified == 'Yes') {
				// email was verified to a different discord
				if (discord != row.discord) {
					return [false, `Email ${email} has already been vefied to a different discord!`];
				}
				// otherwise
				return [false, 'You are already verified! If you don\'t get the new role please message an admin!'];
			}
			else {
				// update timestamp, token, and email
				row.timestamp = timestamp;
				row.token = token;
				row.email = email;
				row.discord = discord;
				row.save();
				return [true, ''];
			}
		}
		else {
			await sheet.addRow({
				timestamp: timestamp,
				email: email,
				discord: discord,
				verified: 'No',
				token: token,
			});
			console.log(`Added a new unverified user! ${discord} ${email}`);
			return [true, ''];
		}
	}
	catch (error) {
		console.log(error);
		return [false, 'An Error has occurrred! Please Contact an admin for help.'];
	}
};


const verifyUser = async (discord, token) => {
	try {
		const timestamp = Date().toLocaleString('en-US', { timeZone: 'EST' });

		const doc = await loadData();
		const sheet = doc.sheetsByIndex[0];
		await sheet.loadCells();
		const rows = await sheet.getRows();

		for (let i = 0 ; i < rows.length; i += 1) {
			if (rows[i].discord == discord) {
				if (rows[i].verified == 'Yes') {
					return 'You\'re already verified!';
				}
				else if (rows[i].token == token) {
					rows[i].timestamp = timestamp;
					rows[i].verified = 'Yes';
					await rows[i].save();

					console.log(`Verified a new user! ${discord} ${rows[i].email}`);
					return 'You are verified!';
				}
				else {
					return 'Wrong token!';
				}
			}
		}
		return 'No entries found, did you try /email?';
	}
	catch (error) {
		console.log(error);
		return 'An error has occurred! Please contact an admin';
	}
};

module.exports = {
	addUser: addUser,
	verifyUser: verifyUser,
};
