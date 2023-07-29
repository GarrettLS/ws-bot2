import { Client, GatewayIntentBits } from 'discord.js';
import { discord_token } from './config.json';
import { ready, interactionCreate } from './listeners';

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

ready(client);
interactionCreate(client);

client.login(discord_token);
