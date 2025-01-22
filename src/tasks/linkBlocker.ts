import { Message } from 'discord.js';

const common = ['https://', 'http://', 'https://www.', 'http://www.'];
const urls = ['x.com', 'facebook.com', 'instagram.com', 'truthsocial.com'];

export default async (message: Message): Promise<void> => {
  if (!message.author.bot) {
    const normalizedUrls = urls.flatMap(u => {
      return common.map(c => c + u);
    });

    if (normalizedUrls.some((w) => message.content.toLowerCase().includes(w))) {
      console.log(`linkBlocker: '${message.content}' blocked from ${message.member?.user.id}.`);
      await message.delete();

      message.channel.send({
        embeds: [
          {
            title: 'Message Blocked.',
            description: `<@${message.member?.user.id}>. We don't support fascist media. All links to these sites are blocked.`
          },
        ],
      });
    }
  }
};
