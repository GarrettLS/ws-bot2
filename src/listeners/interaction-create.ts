import { CommandInteraction, Client, Interaction, Events } from 'discord.js';
import { CommandsList } from '../commands';
import Database from '../db';

export default (client: Client, db: Database): void => {
  client.on(Events.InteractionCreate, async (interaction: Interaction) => {
    if (interaction.isCommand() || interaction.isContextMenuCommand()) {
      await handleSlashCommand(client, interaction, db);
    }
  });
};

const handleSlashCommand = async (client: Client, interaction: CommandInteraction, db: Database): Promise<void> => {
  const slashCommand = CommandsList.find((c) => c.name === interaction.commandName);
  if (!slashCommand) {
    // error response
    return;
  }

  await interaction.deferReply({
    ephemeral: slashCommand.ephemeral,
  });

  slashCommand.run(client, interaction, db);
};
