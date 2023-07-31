import { Client, Events } from 'discord.js';
import { greet } from '../tasks';

export default (client: Client): void => {
  client.on(Events.GuildMemberAdd, async (member) => {
    greet(client, member);
  });
};
