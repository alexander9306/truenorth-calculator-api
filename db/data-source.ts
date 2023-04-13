import { DataSource, DataSourceOptions } from 'typeorm';

export const dataSourceOptions: DataSourceOptions = {
  // For more info about the config: https://typeorm.io/data-source-options#common-data-source-options
  type: 'better-sqlite3',
  database: 'db/db.sqlite3',
  synchronize: true,
  // entities: [User, Operation, Record],
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
