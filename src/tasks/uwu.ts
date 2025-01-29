import { Message, TextChannel } from 'discord.js';
import TenorService from '../services/tenor.service';
import { uwu_channel } from '../config.json';
import Utils from '../utils';
import { IGif, IBypass } from 'src/models';

const words = ['uwu', 'owo'];
const terms = [
  'anime', 'studio ghibli', 'spy x family', 'kawaii', 'iyashikei', 'Nichijou-kei',
  'anime sad', 'anime angry', 'anime bored', 'anime lazy', 'anime frustrated',
  'anime happy', 'anime calm', 'anime energetic', 'anime jealous', 'anime coffee', 'anime food', 'anime joy',
  'anime excited', 'anime hungry', 'anime confused', 'anime silly',
  'anime nervous'];
const filter = [
  'uwu-ts-team-uwu', 'wow', 'yato-herzog', 'really-no-way',
  'happy-girls', 'uwu-cute-arjay-gif', 'nYAbPZ6Im4YAAAAC/uwu-cute',
  'hnwblWiTBC0AAAAC/kawaii-cute', 'KXUppoIwoNsAAAAC/uwu-skeleton', 'CCTYyxh2OXoAAAAC/s',
  'bpVoYKnPJaMAAAAC/pardon-me', 'dragonfish', 'kanna-kamui-kanna-kobayashi', 'me-when-the-gang-leaves'];
const bypassRoles: IBypass[] = [
  {
    userId: '137723595018338304',
    possibility: 100
  },
  {
    userId: '137401966836842496',
    possibility: 80
  }
];
const defaultPossibility = 60;

export default async (message: Message): Promise<void> => {
  if (!message.author.bot && message.channelId === uwu_channel) {
    if (words.some((w) => message.content.toLowerCase().includes(w))) {
      const rolled = Utils.randomPercent();
      const bypassRole = bypassRoles.find(r => message.member?.user.id === r.userId);
      const possibility = bypassRole ? bypassRole.possibility : defaultPossibility;

      console.log(`uwu: '${message.content}' [${rolled} <= ${possibility}]`);

      if (rolled <= possibility) {
        const term = Utils.randomArr(terms) as string;
        const gifs = await TenorService.search(term, 12);
        
        // Remove stupid returns
        const filteredGifs = gifs.filter((g) => !filter.some((f) => g.media[0].gif.url.includes(f)));
        const gif = (Utils.randomArr(filteredGifs) as IGif).media[0].gif;

        console.log(`Sending GIF [${gif.url}] from term '${term}'`);
        
        (message.channel as TextChannel).send({
          embeds: [
            {
              image: { url: gif.url },
            },
          ],
        });
      }
    }
  }
};
