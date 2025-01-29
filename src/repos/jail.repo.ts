import { DataTypes, Sequelize, ModelStatic, Model } from '@sequelize/core';
import { IJail } from 'src/models';
import Utils from '../utils';

export class JailedRepo {
  private data: ModelStatic<Model<IJail, IJail>>;

  constructor(db: Sequelize) {
    this.data = db.define('jail', {
      userId: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
      }
    });
  }

  sync(): void {
    this.data.sync();
  }

  async create(entry: IJail): Promise<Error | null> {
    const hashedUserId = Utils.encrypt(entry.userId);
    try {
      await this.data.create({
        userId: hashedUserId
      });
    } catch (err) {
      return err as Error;
    }
    return null;
  }

  async delete(userId: string): Promise<number> {
    const hashedUserId = Utils.encrypt(userId);
    const affectedCount = await this.data.destroy({ where: { userId: hashedUserId } });

    return affectedCount;
  }

  async get(userId: string): Promise<IJail | null> {
    const hashedUserId = Utils.encrypt(userId);
    const result = await this.data.findOne({ where: { userId: hashedUserId } });

    if (result) {
      const jailed = result.toJSON();
      jailed.userId = Utils.decrypt(jailed.userId);
      return jailed;
    }

    return null;
  }

  async getAll(): Promise<IJail[]> {
    const result = await this.data.findAll();

    if (result.length) {
      const jailed = result.map((j) => j.toJSON());
      jailed.forEach(j => j.userId = Utils.decrypt(j.userId));
      return jailed;
    }

    return [];
  }

  async all(): Promise<IJail[]> {
    const result = await this.data.findAll();

    if (result.length) {
      const jailed = result.map((j) => j.toJSON());
      jailed.forEach(j => j.userId = Utils.decrypt(j.userId));
      return jailed;
    }

    return [];
  }
}
