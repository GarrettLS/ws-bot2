import { Message } from 'discord.js';
import TenorService from '../services/tenor.service';
import { uwu_channel } from '../config.json';
import Utils from '../utils';
import { IGif } from 'src/models/tenor.model';

const words = ['uwu', 'owo'];
const terms = ['uwu', 'anime', 'studio ghibli', 'spy x family', 'kawaii'];

export default (message: Message): void => {
  if (!message.author.bot && message.channelId === uwu_channel) {
    console.log(`Message sent to uwu channel: ${message.content}`);
    if (words.some((w) => message.content.toLowerCase().includes(w))) {
      console.log('Message passed words validation.');
      const rolled = Utils.randomPercent();
      console.log(`Number rolled for uwu: ${rolled}`);
      if (rolled <= 60) {
        const term = Utils.randomArr(terms) as string;
        console.log(`Term used for uwu: ${term}`);
        TenorService.search(term).then((gifs) => {
          const gif = (Utils.randomArr(gifs) as IGif).media[0].gif;
          console.log(`Sending GIF: ${gif.url}`);
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
