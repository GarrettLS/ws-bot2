import { Client, TextChannel } from 'discord.js';
import { primary_channel } from '../config.json';
import Database from '../db';
import cron from 'node-cron';

export default (client: Client, db: Database) => {
  cron.schedule('0 8 * * *', () => {
    const now = new Date();
    db.birthdays.getAllByDate(now.getUTCMonth() + 1, now.getUTCDate()).then((result) => {
      if (result.length) {
        const channel = client.channels.cache.get(primary_channel) as TextChannel;
        const users = result.map((u) => `<@${u.userId}>`).join(', ');

        channel.send({
          content: `Happy birthday ${users}!`,
        });
      }
    });
  });
};
