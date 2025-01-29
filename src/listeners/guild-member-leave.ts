import { Client, Events } from 'discord.js';
import Database from '../db';
import { guildRemove } from '../tasks';

export default (client: Client, db: Database): void => {
  client.on(Events.GuildMemberRemove, async (member) => {
    await guildRemove(member, db);
  });
};
