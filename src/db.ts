import { Sequelize } from 'sequelize';
import { BirthdaysRepo } from './repos/birthday.repo';

export default class Database {
  private sequelize: Sequelize;
  public birthdays: BirthdaysRepo;

  constructor(dbFileName: string) {
    this.sequelize = new Sequelize({
      dialect: 'sqlite',
      logging: false,
      storage: dbFileName,
    });

    this.birthdays = new BirthdaysRepo(this.sequelize);
  }

  sync(): void {
    this.birthdays.sync();
  }
}
