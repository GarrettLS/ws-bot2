import { ChatInputApplicationCommandData, Client, ApplicationCommandType, CommandInteraction } from 'discord.js';
import Database from '../db';

export interface ChatInputCommand extends ChatInputApplicationCommandData {
  type: ApplicationCommandType.ChatInput;
  run: (client: Client, interaction: CommandInteraction, db?: Database) => void;
}
