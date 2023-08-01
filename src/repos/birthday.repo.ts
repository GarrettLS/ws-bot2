import { DataTypes, Sequelize, ModelStatic, Model, Op } from 'sequelize';
import { IBirthday } from 'src/models';

export class BirthdaysRepo {
  private data: ModelStatic<Model<IBirthday, IBirthday>>;

  constructor(db: Sequelize) {
    this.data = db.define('birthdays', {
      userId: {
        type: DataTypes.STRING,
        unique: true,
      },
      month: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      day: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    });
  }

  sync(): void {
    this.data.sync();
  }

  async create(entry: IBirthday): Promise<Error | null> {
    try {
      await this.data.create({
        userId: entry.userId,
        month: entry.month,
        day: entry.day,
      });
    } catch (err) {
      return err as Error;
    }
    return null;
  }

  async update(entry: IBirthday): Promise<number> {
    const [affectedCount] = await this.data.update({ month: entry.month, day: entry.day }, { where: { userId: entry.userId } });

    return affectedCount;
  }

  async delete(userId: string): Promise<number> {
    const affectedCount = await this.data.destroy({ where: { userId: userId } });

    return affectedCount;
  }

  async get(userId: string): Promise<IBirthday | null> {
    const birthday = await this.data.findOne({ where: { userId: userId } });

    if (birthday) {
      return birthday.toJSON();
    }

    return null;
  }

  async getAllByDate(month: number, day: number, isLeapYear: boolean): Promise<IBirthday[]> {
    let birthdays: Model<IBirthday, IBirthday>[] = [];

    // if it isn't leap year and it's mar 1st then get all users with mar 1st and feb 29th
    if (!isLeapYear && month === 3 && day === 1) {
      birthdays = await this.data.findAll({
        where: {
          [Op.or]: [
            { month: month, day: day },
            { month: 2, day: 29 },
          ],
        },
      });
    } else {
      birthdays = await this.data.findAll({ where: { month: month, day: day } });
    }

    if (birthdays.length) {
      return birthdays.map((b) => b.toJSON());
    }

    return [];
  }

  async all(): Promise<IBirthday[]> {
    const birthdays = await this.data.findAll();

    if (birthdays.length) {
      return birthdays.map((b) => b.toJSON());
    }

    return [];
  }
}
