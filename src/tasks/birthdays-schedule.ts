import { Client, TextChannel } from 'discord.js';
import { primary_channel } from '../config.json';
import Database from '../db';
import cron from 'node-cron';
import moment from 'moment';

export default (client: Client, db: Database) => {
  cron.schedule('0 8 * * *', () => {
    const now = moment();

    db.birthdays.getAllByDate(now.month() + 1, now.date()).then((result) => {
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
