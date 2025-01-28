import { Message, PartialMessage, TextChannel } from 'discord.js';
import { IURLModel } from '../models';
import { alternative_media_channel } from '../config.json';

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
const fixedMedias: IURLModel[] = common.flatMap(c => {
  return medias.map(m => {
    return {
      name: m.name,
      url: c + m.url
    };
  });
});

export default async (message: Message | PartialMessage): Promise<void> => {
  if (!message.author?.bot) {
    const found = fixedMedias.find(w => message.content?.toLowerCase().includes(w.url));
    if (found) {
      console.log(`linkBlocker: '${message.content}' blocked from ${message.member?.user.id}.`);
      await message.delete();

      (message.channel as TextChannel).send({
        embeds: [
          {
            title: 'Message Blocked.',
            description: `<@${message.member?.user.id}>. We don't support fascist media. All links to ${found.name} are blocked.`,
            fields: [
              {
                name: 'Alternatives',
                value: `Check out <#${alternative_media_channel}> pinned messages for more information about what sources we don't allow, and alternatives to better media sources.`,
              }
            ],
          },
        ],
      });
    }
  }
};
