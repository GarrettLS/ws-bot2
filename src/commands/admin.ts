import { Client, ApplicationCommandType, ApplicationCommandOptionType, ChatInputCommandInteraction, CommandInteraction, PermissionFlagsBits, APIEmbedField, MessageFlags } from 'discord.js';
import { ChatInputCommand } from '.';
import { CommandNames } from '../models';
import Database from '../db';
import moment from 'moment';

export const Admin: ChatInputCommand = {
  name: CommandNames.ADMIN,
  description: 'WSBot Admin: Administrator commands',
  type: ApplicationCommandType.ChatInput,
  flags: MessageFlags.Ephemeral,
  defaultMemberPermissions: PermissionFlagsBits.Administrator,
  options: [
    {
      name: CommandNames.ADMIN_LIST_BIRTHDAYS,
      description: 'WSBot Admin: List birthdays',
      type: ApplicationCommandOptionType.Subcommand,
    },
  ],
  run: async (_client: Client, interaction: CommandInteraction, db?: Database) => {
    const chatInputInter = interaction as ChatInputCommandInteraction;
    const subCommand = chatInputInter.options.getSubcommand(true);

    switch (subCommand) {
      case CommandNames.ADMIN_LIST_BIRTHDAYS: {
        console.log(`Admin with user ID ${chatInputInter.user.id} checked all of the birthdays in the database.`);
        db?.birthdays.getAll().then(async (result) => {
          if (result.length) {
            await interaction.followUp({
              flags: MessageFlags.Ephemeral,
              embeds: [
                {
                  title: 'Users Birthdays',
                  description: 'Users birthdays stored in the database',
                  fields: result.map((birthday) => {
                    return {
                      name: birthday.userId,
                      value: `${moment({ month: birthday.month - 1, day: birthday.day, hour: 8 }).format('MMMM Do, h a')} CST`,
                    } as APIEmbedField;
                  }),
                },
              ],
            });
          } else {
            await interaction.followUp({
              flags: MessageFlags.Ephemeral,
              content: 'No birthdays stored in the database.',
            });
          }
        });
        break;
      }
    }
  },
};
