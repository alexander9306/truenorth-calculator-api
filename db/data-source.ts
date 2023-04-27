import 'dotenv/config';
import { DataSource } from 'typeorm';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';

export const dataSourceOptions: PostgresConnectionOptions = {
  // For more info about the config: https://typeorm.io/data-source-options#common-data-source-options
  type: 'postgres',
  url:
    process.env.PG_CONNECTION_STRING ??
    'postgres://postgres:postgrespw@localhost:32770',
  synchronize: process.env.NODE_ENV === 'development',
  entities: ['dist/**/*.entity.js'],
  migrations: ['dist/db/migrations/*.js'],
  logging: process.env.DATABASE_LOGGING === 'true',
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
