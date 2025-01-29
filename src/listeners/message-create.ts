import { Client, Events } from 'discord.js';
import { uwu, linkBlocker } from '../tasks';

export default (client: Client): void => {
  client.on(Events.MessageCreate, async (message) => {
    await linkBlocker(message);
    await uwu(message);
  });
};
