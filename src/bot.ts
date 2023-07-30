import { Client, GatewayIntentBits } from 'discord.js';
import { ready, interactionCreate, messageCreate, guildMemberAdd } from './listeners';
import Database from './db';

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const db = new Database('db.sqlite');

// Listeners
ready(client, db);
interactionCreate(client, db);
messageCreate(client);
guildMemberAdd(client);

client.login(process.env.DISCORD_TOKEN);
