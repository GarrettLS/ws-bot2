import { CommandInteraction, ChatInputApplicationCommandData, Client } from 'discord.js';

export interface BaseCommand extends ChatInputApplicationCommandData {
  run: (client: Client, interaction: CommandInteraction) => void;
}
