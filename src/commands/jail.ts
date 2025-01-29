import { Client, ApplicationCommandType, ApplicationCommandOptionType, ChatInputCommandInteraction, CommandInteraction, PermissionFlagsBits, MessageFlags } from 'discord.js';
import { ChatInputCommand } from '.';
import { CommandNames } from '../models';
import Database from '../db';

export const Jail: ChatInputCommand = {
  name: CommandNames.JAIL,
  description: 'WSBot Jail: Administrator command',
  type: ApplicationCommandType.ChatInput,
  flags: MessageFlags.Ephemeral,
  defaultMemberPermissions: PermissionFlagsBits.Administrator,
  options: [
    {
      name: CommandNames.ADD,
      description: 'WSBot Jail: Jail user (emoji assault)',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: CommandNames.USER,
          description: 'User',
          type: ApplicationCommandOptionType.User,
          required: true,
        }
      ],
    },
    {
      name: CommandNames.REMOVE,
      description: 'WSBot Jail: Remove user from the emoji assault',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: CommandNames.USER,
          description: 'User',
          type: ApplicationCommandOptionType.User,
          required: true,
        }
      ],
    },
  ],
  run: async (_client: Client, interaction: CommandInteraction, db?: Database) => {
    const chatInputInter = interaction as ChatInputCommandInteraction;
    const subCommand = chatInputInter.options.getSubcommand(true);

    switch (subCommand) {
      case CommandNames.ADD: {
        const user = chatInputInter.options.get(CommandNames.USER)?.value as string;
        console.log(`Admin with user ID ${chatInputInter.user.id} jailed ${user}.`);

        const err = await db?.jailed.create({
          userId: user
        });
        
        let content = 'Added user to jail.';

        if (err) {
          console.log(err);
          if (err.name === 'SequelizeUniqueConstraintError') {
            content = 'User already exists in jail.';
          } else {
            content = 'Something went wrong with adding the user.';
          }
        }

        interaction.followUp({
          flags: MessageFlags.Ephemeral,
          content,
        });
        break;
      }
      case CommandNames.REMOVE: {
        console.log('Removing user from jail.');
        const user = chatInputInter.options.get(CommandNames.USER)?.value as string;
        const affectedCount = await db?.jailed.delete(user);

        let content = 'Removed user from jail.';

        if (affectedCount && affectedCount < 1) {
          content = 'This user is not yet jailed.';
        }

        interaction.followUp({
          flags: MessageFlags.Ephemeral,
          content,
        });
        break;
      }
    }
  },
};
