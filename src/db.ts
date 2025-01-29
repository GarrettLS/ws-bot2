import { Sequelize } from '@sequelize/core';
import { MariaDbDialect } from '@sequelize/mariadb';
import { BirthdaysRepo, JailedRepo } from './repos';

export default class Database {
  private sequelize: Sequelize;
  public birthdays: BirthdaysRepo;
  public jailed: JailedRepo;

  constructor() {
    this.sequelize = new Sequelize({
      dialect: MariaDbDialect,
      database: process.env.DATABASE_NAME,
      user: process.env.DATABASE_USER,
      password: process.env.DATABASE_PASSWORD,
      host: process.env.DATABASE_HOST,
      port: 3306,
      showWarnings: true,
      connectTimeout: 1000
    });

    this.birthdays = new BirthdaysRepo(this.sequelize);
    this.jailed = new JailedRepo(this.sequelize);
  }

  sync(): void {
    this.birthdays.sync();
    this.jailed.sync();
  }
}
