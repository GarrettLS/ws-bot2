import { Message } from 'discord.js';
import Database from '../db';
import Utils from '../utils';

const reactions = ['1292543488625213470', '1010976164401123369', '862886800376594473', '1100946248099442778', '866684794284539915', '441680403707854858', '1316152644259287122', '1135927339193204756', '🤔'];
const avoidChannels = ['819004915112083469', '889133720076951612', '862012116444381194', '946441582490550312', '811979925878997043', '826066374878429234', '862015528250638377'];
const targetCategory = '😗🔆 general chats 🔆😗';

export default async (message: Message, db: Database): Promise<void> => {
  const channel = message.guild?.channels.cache.find(c => c.id === message.channel.id);
  const category = message.guild?.channels.cache.find(c => c.id === channel?.parent?.id);

  console.log(`checking if correct channel for jailed reaction - Category:${category?.name} | Channel ${channel?.name}`);
  if (!message.author?.bot && message.member && category?.name.toLocaleLowerCase() === targetCategory && (channel && !avoidChannels.includes(channel.id))) {
    const result = await db.jailed.get(message.member.user.id);

    if (result) {
      const rolled = Utils.randomPercent();

      if (rolled <= 20) {
        const reaction = Utils.randomArr(reactions) as string;
        const emoji = message.client.emojis.cache.get(reaction);
        
        console.log(`Jailed reaction successful. Reacting with ${emoji ? emoji.name : reaction} on ${message.member.user.id} message.`);
        message.react(emoji ?? reaction);
      }
    }
  }
};
