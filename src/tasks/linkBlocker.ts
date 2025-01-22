import { Message } from 'discord.js';
import { IURLModel } from '../models';

const common = ['https://', 'http://', 'https://www.', 'http://www.'];
const medias: IURLModel[] = [
  {
    name: 'Twitter',
    url: 'x.com'
  },
  {
    name: 'Facebook',
    url: 'facebook.com'
  },
  {
    name: 'Instagram',
    url: 'instagram.com'
  },
  {
    name: 'Truth Social',
    url: 'truthsocial.com'
  }
];

export default async (message: Message): Promise<void> => {
  if (!message.author.bot) {
    const fixedMedias: IURLModel[] = common.flatMap(c => {
      return medias.map(m => {
        return {
          name: m.name,
          url: c + m.url
        };
      });
    });

    console.log(fixedMedias);

    const found = fixedMedias.find(w => message.content.toLowerCase().includes(w.url));
    if (found) {
      console.log(`linkBlocker: '${message.content}' blocked from ${message.member?.user.id}.`);
      await message.delete();

      message.channel.send({
        embeds: [
          {
            title: 'Message Blocked.',
            description: `<@${message.member?.user.id}>. We don't support fascist media. All links to ${found.name} are blocked.`
          },
        ],
      });
    }
  }
};
