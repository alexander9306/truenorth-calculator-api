import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { OperationsModule } from './operations/operations.module';
import { RecordsModule } from './records/records.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // For more info about the config: https://typeorm.io/data-source-options#common-data-source-options
      type: 'better-sqlite3',
      database: 'db.sqlite',
      synchronize: true,
    }),
    UsersModule,
    OperationsModule,
    RecordsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
