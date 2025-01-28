import { ChatInputApplicationCommandData, Client, ApplicationCommandType, CommandInteraction, MessageFlags, BitFieldResolvable, MessageFlagsString } from 'discord.js';
import Database from '../db';

export interface ChatInputCommand extends ChatInputApplicationCommandData {
  type: ApplicationCommandType.ChatInput;
  flags?: BitFieldResolvable<
      Extract<MessageFlagsString, 'Ephemeral' | 'SuppressEmbeds' | 'SuppressNotifications'>,
      MessageFlags.Ephemeral | MessageFlags.SuppressEmbeds | MessageFlags.SuppressNotifications
    >;
  run: (client: Client, interaction: CommandInteraction, db?: Database) => void;
}
