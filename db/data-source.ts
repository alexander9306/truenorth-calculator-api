import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const dataSourceOptions: PostgresConnectionOptions = {
  // For more info about the config: https://typeorm.io/data-source-options#common-data-source-options
  type: 'postgres',
  url: 'postgres://postgres:postgrespw@localhost:32768',
  synchronize: false,
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
