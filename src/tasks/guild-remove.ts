import { GuildMember, PartialGuildMember } from 'discord.js';
import Database from '../db';

export default async (member: GuildMember | PartialGuildMember, db: Database) => {
  const userId = member.user.id;
  try {
    const result = await db.birthdays.delete(userId);
    if (result) {
      console.log(`Birthday removed from schedule on guild member leaving: ${userId}`);
    }
  } catch (err) {
    console.log(err);
  }
};
