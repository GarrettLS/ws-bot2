import { Message } from 'discord.js';
import TenorService from '../services/tenor.service';
import { uwu_channel } from '../config.json';
import Utils from '../utils';
import { IGif } from 'src/models/tenor.model';

const words = ['uwu', 'owo'];
const terms = ['uwu', 'anime', 'studio ghibli', 'spy x family', 'kawaii'];
const filter = [
  'uwu-ts-team-uwu', 'wow', 'yato-herzog', 'really-no-way',
  'happy-girls', 'uwu-cute-arjay-gif', 'nYAbPZ6Im4YAAAAC/uwu-cute',
  'hnwblWiTBC0AAAAC/kawaii-cute', 'KXUppoIwoNsAAAAC/uwu-skeleton', 'CCTYyxh2OXoAAAAC/s'];
const bypassRoles = ['1164320609170374678'];

export default async (message: Message): Promise<void> => {
  if (!message.author.bot && message.channelId === uwu_channel) {
    if (words.some((w) => message.content.toLowerCase().includes(w))) {
      const rolled = Utils.randomPercent();
      console.log(`uwu: '${message.content}' [${rolled} <= 60]`);
      if (message.member?.roles.cache.hasAny(...bypassRoles) || rolled <= 60) {
        const term = Utils.randomArr(terms) as string;
        await TenorService.search(term, 12).then((gifs) => {
          // Remove stupid returns
          const filteredGifs = gifs.filter((g) => !filter.some((f) => g.media[0].gif.url.includes(f)));
          const gif = (Utils.randomArr(filteredGifs) as IGif).media[0].gif;
          console.log(`Sending GIF [${gif.url}] from term '${term}'`);
          message.channel.send({
            embeds: [
              {
                image: { url: gif.url },
              },
            ],
          });
        });
      }
    }
  }
};
