import { DataTypes, Sequelize, ModelStatic, Model, Op } from '@sequelize/core';
import { IBirthday } from 'src/models';
import Utils from '../utils';

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
    const hashedUserId = Utils.encrypt(entry.userId);
    try {
      await this.data.create({
        userId: hashedUserId,
        month: entry.month,
        day: entry.day,
      });
    } catch (err) {
      return err as Error;
    }
    return null;
  }

  async update(entry: IBirthday): Promise<number> {
    const hashedUserId = Utils.encrypt(entry.userId);
    const [affectedCount] = await this.data.update({ month: entry.month, day: entry.day }, { where: { userId: hashedUserId } });

    return affectedCount;
  }

  async delete(userId: string): Promise<number> {
    const hashedUserId = Utils.encrypt(userId);
    const affectedCount = await this.data.destroy({ where: { userId: hashedUserId } });

    return affectedCount;
  }

  async get(userId: string): Promise<IBirthday | null> {
    const hashedUserId = Utils.encrypt(userId);
    const result = await this.data.findOne({ where: { userId: hashedUserId } });

    if (result) {
      const birthday = result.toJSON();
      birthday.userId = Utils.decrypt(birthday.userId);
      return birthday;
    }

    return null;
  }

  async getAll(): Promise<IBirthday[]> {
    const result = await this.data.findAll();

    if (result.length) {
      const birthdays = result.map((b) => b.toJSON());
      birthdays.forEach(b => b.userId = Utils.decrypt(b.userId));
      return birthdays;
    }

    return [];
  }

  async getAllByDate(month: number, day: number, isLeapYear: boolean): Promise<IBirthday[]> {
    let result: Model<IBirthday, IBirthday>[] = [];

    // if it isn't leap year and it's mar 1st then get all users with mar 1st and feb 29th
    if (!isLeapYear && month === 3 && day === 1) {
      result = await this.data.findAll({
        where: {
          [Op.or]: [
            { month: month, day: day },
            { month: 2, day: 29 },
          ],
        },
      });
    } else {
      result = await this.data.findAll({ where: { month: month, day: day } });
    }

    if (result.length) {
      const birthdays = result.map((b) => b.toJSON());
      birthdays.forEach(b => b.userId = Utils.decrypt(b.userId));
      return birthdays;
    }

    return [];
  }

  async all(): Promise<IBirthday[]> {
    const result = await this.data.findAll();

    if (result.length) {
      const birthdays = result.map((b) => b.toJSON());
      birthdays.forEach(b => b.userId = Utils.decrypt(b.userId));
      return birthdays;
    }

    return [];
  }
}
