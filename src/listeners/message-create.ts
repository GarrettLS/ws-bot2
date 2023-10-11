import { Client, Events } from 'discord.js';
import { uwu, godReact } from '../tasks';

export default (client: Client): void => {
  client.on(Events.MessageCreate, async (message) => {
    uwu(message);
    godReact(message);
  });
};
