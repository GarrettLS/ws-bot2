import { Message } from 'discord.js';
import TenorService from '../services/tenor.service';
import { uwu_channel } from '../config.json';
import Utils from '../utils';
import { IGif } from 'src/models/tenor.model';

const words = ['uwu', 'owo'];
const terms = ['uwu', 'anime', 'studio ghibli', 'spy x family', 'kawaii'];

export default async (message: Message): Promise<void> => {
  if (!message.author.bot && message.channelId === uwu_channel) {
    if (words.some((w) => message.content.toLowerCase().includes(w))) {
      const rolled = Utils.randomPercent();
      console.log(`uwu: '${message.content}' [${rolled} <= 60]`);
      if (rolled <= 60) {
        const term = Utils.randomArr(terms) as string;
        await TenorService.search(term).then((gifs) => {
          const gif = (Utils.randomArr(gifs) as IGif).media[0].gif;
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
