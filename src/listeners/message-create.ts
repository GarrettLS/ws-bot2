import { Client, Events } from 'discord.js';
import { uwu, linkBlocker, jailedReaction} from '../tasks';
import Database from '../db';

export default (client: Client, db: Database): void => {
  client.on(Events.MessageCreate, async (message) => {
    await linkBlocker(message);
    await uwu(message);
    await jailedReaction(message, db);
  });
};
