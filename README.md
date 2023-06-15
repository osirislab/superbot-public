# superbot
A bot to handle administration tasks in the Discord server

NOTE: Using Twilio's SendGrid to send emails from your account. Free plan limits at 100 emails a day.

- https://discord.js.org
- https://github.com/theoephraim/node-google-spreadsheet

## Create a bot
- https://www.ionos.com/digitalguide/server/know-how/creating-discord-bot/


## build .env
- Create file `.env`. Doc -> https://www.npmjs.com/package/dotenv
- Keys:
    - `TOKEN`: Discord bot token
    - `CLIENT_ID`: Discord bot client id
    - `SHEETS_ID`: google sheet's id -> `https://docs.google.com/spreadsheets/d/{SHEETS_ID}/edit#gid=0`
    - `SENDGRID_API_KEY`: `https://app.sendgrid.com/guide/integrate/langs/nodejs`
    - `SENDER`: Sender's email address on SendGrid
    - `ROLE_NAME`: The role people would get after they pass verification
    - `SERVER_NAME`: Your server's name
    

## Google spreadsheet
- Create `google_creds.json`
- https://theoephraim.github.io/node-google-spreadsheet/#/getting-started/authentication?id=service-account

## Running
```bash
npm init
npm install
node app.js
```

In order to register a command, run 
- `node deploy-commands.js`

Linting:
- `npx eslint --fix`

# Author
- Andre
- Allen
- n132
