import { Client, Events } from 'discord.js';
import { CommandsList } from '../commands';

export default (client: Client): void => {
  client.on(Events.ClientReady, async () => {
    if (!client.user || !client.application) {
      return;
    }

    await client.application.commands.set(CommandsList);

    console.log(`${client.user.username} is online`);
  });
};
