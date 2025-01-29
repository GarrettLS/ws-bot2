import { Client, TextChannel } from 'discord.js';
import { primary_channel } from '../config.json';
import Database from '../db';
import cron from 'node-cron';
import moment from 'moment';

export default (client: Client, db: Database) => {
  cron.schedule('0 8 * * *', async () => {
    const now = moment();
    const month = now.month() + 1;
    const day = now.date();
    const isLeapYear = now.isLeapYear();
    const isRealLeapDay = isLeapYear && month === 2 && day === 29;
    console.log(`Checking for birthdays for ${now}...`);

    const result = await db.birthdays.getAllByDate(month, day, isLeapYear);

    if (result.length) {
      console.log(`${result.length} brithdays found.`);
      const channel = client.channels.cache.get(primary_channel) as TextChannel;
      const users = result.map((u) => `<@${u.userId}>`).join(', ');

      await channel.send({
        content: `Happy birthday ${users}!${isRealLeapDay ? ' You have finally aged after four years.' : ''}`,
      });
    } else {
      console.log('No birthdays found.');
    }
  });
};
