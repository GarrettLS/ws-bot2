import { Client, GatewayIntentBits } from 'discord.js';
import { ready, interactionCreate, messageCreate, messageUpdate, guildMemberAdd } from './listeners';
import Database from './db';
import { config } from 'dotenv';
import guildMemberLeave from './listeners/guild-member-leave';

if (process.env.NODE_ENV !== 'production') {
  config({
    path: '.env',
  });
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMembers, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildMessageReactions],
});

const db = new Database();

// Listeners
ready(client, db);
interactionCreate(client, db);
messageCreate(client);
messageUpdate(client);
guildMemberAdd(client);
guildMemberLeave(client, db);

client.login(process.env.DISCORD_TOKEN);
