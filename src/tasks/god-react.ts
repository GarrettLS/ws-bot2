import { Message } from 'discord.js';
import { god_role } from '../config.json';
import Utils from '../utils';

export default async (message: Message): Promise<void> => {
  const rolled = Utils.randomPercent();
  if (!message.author.bot && message.member?.roles.cache.has(god_role) && rolled <= 25) {
    message.react('👑');
  }
};
