import { Client, GatewayIntentBits } from 'discord.js';
import { ready, interactionCreate, messageCreate, guildMemberAdd } from './listeners';
import Database from './db';
import { config } from 'dotenv';
import guildMemberLeave from './listeners/guild-member-leave';

if (process.env.NODE_ENV !== 'production') {
  config({
    path: '.env',
  });
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

const db = new Database('data/db.sqlite');

// Listeners
ready(client, db);
interactionCreate(client, db);
messageCreate(client);
guildMemberAdd(client);
guildMemberLeave(client, db);

client.login(process.env.DISCORD_TOKEN);
