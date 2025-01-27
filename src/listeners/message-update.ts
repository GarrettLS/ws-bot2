import { Client, Events } from 'discord.js';
import { linkBlocker } from '../tasks';

export default (client: Client): void => {
  client.on(Events.MessageUpdate, async (_, newMsg) => {
    linkBlocker(newMsg);
  });
};