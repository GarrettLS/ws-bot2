import { GuildMember, PartialGuildMember } from 'discord.js';
import Database from '../db';

export default (member: GuildMember | PartialGuildMember, db: Database) => {
  const userId = member.user.id;
  db.birthdays
    .delete(userId)
    .then((result) => {
      if (result) {
        console.log(`Birthday removed from schedule on guild member leaving: ${userId}`);
      }
    })
    .catch((err) => console.log(err));
};
