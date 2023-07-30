import { Client, Events, TextChannel } from 'discord.js';
import { greeting_channel, guide_channel, roles_channel } from '../config.json';

export default (client: Client): void => {
  client.on(Events.GuildMemberAdd, async (member) => {
    const channel = client.channels.cache.get(greeting_channel) as TextChannel;
    console.log(channel);

    channel.send({
      embeds: [
        {
          title: 'Greetings',
          description: `Welcome to Sharing is Caring <@${member.user.id}>!`,
          fields: [
            {
              name: 'Guide',
              value: `Check out <#${guide_channel}> for information about the server.`,
            },
            {
              name: 'Roles',
              value: `See <#${roles_channel}> for adding or removing roles related to specific games.`,
            },
          ],
        },
      ],
    });
  });
};
