import { Message } from 'discord.js';
import TenorService from '../services/tenor.service';
import { uwu_channel } from '../config.json';
import Utils from '../utils';
import { IGif } from 'src/models/tenor.model';

const words = ['uwu', 'owo'];
const terms = ['uwu', 'anime', 'studio ghibli', 'spy x family', 'kawaii'];

export default (message: Message): void => {
  if (message.channelId === uwu_channel && words.some((w) => message.content.toLowerCase().includes(w))) {
    if (Utils.randomPercent() <= 100) {
      const term = Utils.randomArr(terms) as string;
      TenorService.search(term).then((gifs) => {
        const gif = (Utils.randomArr(gifs) as IGif).media[0].gif;
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
};
