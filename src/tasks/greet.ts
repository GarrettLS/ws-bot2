import { Client, GuildMember, TextChannel } from 'discord.js';
import { greeting_channel, guide_channel, roles_channel } from '../config.json';

export default (client: Client, member: GuildMember): void => {
  const channel = client.channels.cache.get(greeting_channel) as TextChannel;
  console.log(`Greeting ${member.user.displayName}`);
  channel.send({
    embeds: [
      {
        title: 'Greetings',
        description: `Welcome to Sharing is Caring <@${member.user.id}>!`,
        fields: [
          {
            name: 'Guide',
            value: `Check out <#${guide_channel}> for information about the server. Also there you can take the Knights Radiant quiz so you can select a fancy role.`,
          },
          {
            name: 'Roles',
            value: `See <#${roles_channel}> for adding or removing roles related to activities and the Knights Radiant quiz.`,
          },
        ],
      },
    ],
  });
};
