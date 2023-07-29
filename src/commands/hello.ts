import { CommandInteraction, Client, ApplicationCommandType } from 'discord.js';
import { BaseCommand } from '.';

export const Hello: BaseCommand = {
  name: 'hello',
  description: 'greeting',
  type: ApplicationCommandType.ChatInput,
  run: async (client: Client, interaction: CommandInteraction) => {
    const content = 'Hello';

    await interaction.followUp({
      ephemeral: true,
      content,
    });
  },
};
