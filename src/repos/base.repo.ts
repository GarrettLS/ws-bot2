import { DataTypes, Sequelize, ModelStatic, Model } from 'sequelize';

export class BirthdaysRepo {
  db: Sequelize;
  data: ModelStatic<Model<never, never>>;

  constructor(db: Sequelize) {
    this.db = db;

    this.data = this.db.define('birthdays', {
      userId: {
        type: DataTypes.STRING,
        unique: true,
      },
      birthday: {
        type: DataTypes.DATE,
        allowNull: false,
      },
    });
  }
}
