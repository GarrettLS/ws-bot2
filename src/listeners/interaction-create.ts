import { CommandInteraction, Client, Interaction, Events } from 'discord.js';
import { CommandsList } from '../commands';

export default (client: Client): void => {
  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      await handleSlashCommand(client, interaction);
    }
  });
};

const handleSlashCommand = async (client: Client, interaction: CommandInteraction): Promise<void> => {
  const slashCommand = CommandsList.find((c) => c.name === interaction.commandName);
  if (!slashCommand) {
    // error response
    return;
  }

  await interaction.deferReply();

  slashCommand.run(client, interaction);
};
