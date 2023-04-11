import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
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
import { QueryErrorFilter } from './shared/filters/query-failed-error.filter';
import { CustomErrorFilter } from './shared/filters/custom-error.filter';
import { AuthModule } from './auth/auth.module';

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
    AuthModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    {
      provide: APP_FILTER,
      useClass: QueryErrorFilter,
    },
    {
      provide: APP_FILTER,
      useClass: CustomErrorFilter,
    },
  ],
})
export class AppModule {}
