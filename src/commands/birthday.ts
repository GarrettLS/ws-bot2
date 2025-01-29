import { Client, ApplicationCommandType, ApplicationCommandOptionType, ChatInputCommandInteraction, CommandInteraction, MessageFlags } from 'discord.js';
import { ChatInputCommand } from '.';
import { CommandNames } from '../models';
import Database from '../db';
import moment from 'moment';

export const Birthday: ChatInputCommand = {
  name: CommandNames.BIRTHDAY,
  description: 'WSBot: Manage your birthday schedule',
  type: ApplicationCommandType.ChatInput,
  flags: MessageFlags.Ephemeral,
  options: [
    {
      name: CommandNames.BIRTHDAY_ADD,
      description: 'WSBot: Add your birthday to the schedule',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: CommandNames.BIRTHDAY_MONTH,
          description: 'Birthday month number (MM)',
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: CommandNames.BIRTHDAY_DAY,
          description: 'Birthday day number (DD)',
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ],
    },
    {
      name: CommandNames.BIRTHDAY_REMOVE,
      description: 'WSBot: Remove your birthday from the schedule',
      type: ApplicationCommandOptionType.Subcommand,
    },
    {
      name: CommandNames.BIRTHDAY_UPDATE,
      description: 'WSBot: Update your birthday on the schedule',
      type: ApplicationCommandOptionType.Subcommand,
      options: [
        {
          name: CommandNames.BIRTHDAY_MONTH,
          description: 'Birthday month number (MM)',
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
        {
          name: CommandNames.BIRTHDAY_DAY,
          description: 'Birthday day number (DD)',
          type: ApplicationCommandOptionType.Integer,
          required: true,
        },
      ],
    },
    {
      name: CommandNames.BIRTHDAY_CHECK,
      description: 'WSBot: Shows the birthday you have on schedule',
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  run: async (client: Client, interaction: CommandInteraction, db?: Database) => {
    const chatInputInter = interaction as ChatInputCommandInteraction;
    const subCommand = chatInputInter.options.getSubcommand(true);

    switch (subCommand) {
      case CommandNames.BIRTHDAY_ADD: {
        const month = chatInputInter.options.get(CommandNames.BIRTHDAY_MONTH)?.value as number;
        const day = chatInputInter.options.get(CommandNames.BIRTHDAY_DAY)?.value as number;
        const date = moment({ year: 0, month: month - 1, day });
        console.log(`Trying to add birthday for date: ${date}.`);

        if (date.isValid()) {
          console.log('Birthday valid. Adding to the database.');
          const err = await db?.birthdays.create({
            userId: chatInputInter.user.id,
            month,
            day,
          });
          
          let content = 'Added your birthday to the schedule.';

          if (err) {
            console.log(err);
            if (err.name === 'SequelizeUniqueConstraintError') {
              content = 'Your birthday already exists on the schedule.';
            } else {
              content = 'Something went wrong with adding the birthday.';
            }
          }

          interaction.followUp({
            flags: MessageFlags.Ephemeral,
            content,
          });
        } else {
          console.log('Invalid birthday date added.');
          interaction.followUp({
            flags: MessageFlags.Ephemeral,
            content: 'Invalid date',
          });
        }

        break;
      }
      case CommandNames.BIRTHDAY_REMOVE: {
        console.log('Deleting birthday from the database.');
        const affectedCount = await db?.birthdays.delete(chatInputInter.user.id);
        let content = 'Removed your birthday from the schedule.';

        if (affectedCount && affectedCount < 1) {
          content = 'Your birthday isnt scheduled.';
        }

        interaction.followUp({
          flags: MessageFlags.Ephemeral,
          content,
        });
        break;
      }
      case CommandNames.BIRTHDAY_UPDATE: {
        console.log('Updating birthday to the database.');
        const month = chatInputInter.options.get(CommandNames.BIRTHDAY_MONTH)?.value as number;
        const day = chatInputInter.options.get(CommandNames.BIRTHDAY_DAY)?.value as number;
        const date = moment({ year: 0, month: month - 1, day }).utc();

        if (date.isValid()) {
          const affectedCount = await db?.birthdays.update({
            userId: chatInputInter.user.id,
            month,
            day,
          });
          
          let content = 'Updated your birthday on the schedule';

          if (affectedCount && affectedCount < 1) {
            content = 'Your birthday isnt scheduled.';
          }

          interaction.followUp({
            flags: MessageFlags.Ephemeral,
            content,
          });
        } else {
          console.log('Invalid birthday date added.');
          interaction.followUp({
            flags: MessageFlags.Ephemeral,
            content: 'Invalid date.',
          });
        }

        break;
      }
      case CommandNames.BIRTHDAY_CHECK: {
        console.log('User checking birthday.');
        const result = await db?.birthdays.get(chatInputInter.user.id);
        
        if (result) {
          interaction.followUp({
            flags: MessageFlags.Ephemeral,
            content: `Birthday announcement set for ${moment({ month: result.month - 1, day: result.day, hour: 8 }).format('MMMM Do, h a')} CST`,
          });
        }
        break;
      }
    }
  },
};
