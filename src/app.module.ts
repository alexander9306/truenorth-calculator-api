import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { OperationsModule } from './operations/operations.module';
import { RecordsModule } from './records/records.module';
import { User } from './users/entities/user.entity';
import { Operation } from './operations/entities/operation.entity';
import { Record } from './records/entities/record.entity';
import { SharedModule } from './shared/shared.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      // For more info about the config: https://typeorm.io/data-source-options#common-data-source-options
      type: 'better-sqlite3',
      database: 'db.sqlite',
      synchronize: true,
      entities: [User, Operation, Record],
    }),
    ConfigModule.forRoot(),
    UsersModule,
    OperationsModule,
    RecordsModule,
    SharedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
