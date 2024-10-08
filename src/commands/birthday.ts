import { Client, ApplicationCommandType, ApplicationCommandOptionType, ChatInputCommandInteraction, CommandInteraction } from 'discord.js';
import { ChatInputCommand } from '.';
import { CommandNames } from '../models';
import Database from '../db';
import moment from 'moment';

export const Birthday: ChatInputCommand = {
  name: CommandNames.BIRTHDAY,
  description: 'WSBot: Manage your birthday schedule',
  type: ApplicationCommandType.ChatInput,
  ephemeral: true,
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
        console.log(`Trying to add birthday for date: ${date} for ID ${chatInputInter.user.id}.`);

        if (date.isValid()) {
          console.log('Birthday valid. Adding to the database.');
          db?.birthdays
            .create({
              userId: chatInputInter.user.id,
              month,
              day,
            })
            .then(async (err) => {
              let content = 'Added your birthday to the schedule.';
              if (err) {
                if (err.name === 'SequelizeUniqueConstraintError') {
                  content = 'Your birthday already exists on the schedule.';
                } else {
                  content = 'Something went wrong with adding the birthday.';
                }
              }

              await interaction.followUp({
                ephemeral: true,
                content,
              });
            });
        } else {
          await interaction.followUp({
            ephemeral: true,
            content: 'Invalid date',
          });
        }

        break;
      }
      case CommandNames.BIRTHDAY_REMOVE: {
        console.log(`Deleting birthday from the database for ID ${chatInputInter.user.id}.`);
        db?.birthdays.delete(chatInputInter.user.id).then(async (affectedCount) => {
          let content = 'Removed your birthday from the schedule.';

          if (affectedCount < 1) {
            content = 'Your birthday isnt scheduled.';
          }

          await interaction.followUp({
            ephemeral: true,
            content,
          });
        });
        break;
      }
      case CommandNames.BIRTHDAY_UPDATE: {
        console.log(`Updating birthday to the database for ID ${chatInputInter.user.id}.`);
        const month = chatInputInter.options.get(CommandNames.BIRTHDAY_MONTH)?.value as number;
        const day = chatInputInter.options.get(CommandNames.BIRTHDAY_DAY)?.value as number;
        const date = moment({ year: 0, month: month - 1, day }).utc();

        if (date.isValid()) {
          db?.birthdays
            .update({
              userId: chatInputInter.user.id,
              month,
              day,
            })
            .then(async (affectedCount) => {
              let content = 'Updated your birthday on the schedule';

              if (affectedCount < 1) {
                content = 'Your birthday isnt scheduled.';
              }

              await interaction.followUp({
                ephemeral: true,
                content,
              });
            });
        } else {
          await interaction.followUp({
            ephemeral: true,
            content: 'Invalid date.',
          });
        }

        break;
      }
      case CommandNames.BIRTHDAY_CHECK: {
        console.log(`User ID ${chatInputInter.user.id} checking birthday.`);
        db?.birthdays.get(chatInputInter.user.id).then(async (result) => {
          if (result) {
            await interaction.followUp({
              ephemeral: true,
              content: `Birthday announcement set for ${moment({ month: result.month - 1, day: result.day, hour: 8 }).format('MMMM Do, h a')} CST`,
            });
          }
        });
        break;
      }
    }
  },
};
