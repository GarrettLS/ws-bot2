import { Client, Events } from 'discord.js';
import { CommandsList } from '../commands';
import Database from '../db';
import { birthdaySchedule } from '../tasks';

export default (client: Client, db: Database): void => {
  client.once(Events.ClientReady, async () => {
    if (!client.user || !client.application) {
      return;
    }

    db.sync();

    birthdaySchedule(client, db);

    await client.application.commands.set(CommandsList);

    console.log(`${client.user.username} is online`);
  });
};
