import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { OperationsModule } from './operations/operations.module';
import { RecordsModule } from './records/records.module';
import { DuplicateKeyExceptionFilter } from './errors/filters/duplicate-key-exception.filter';
import { ExceptionToHttpExceptionFilter } from './errors/filters/exception-to-http-exception.filter';
import { AuthModule } from './auth/auth.module';
import { JwtModule } from '@nestjs/jwt';
import { dataSourceOptions } from 'db/data-source';
import { JwtAuthGuard } from './auth/jwt-auth.guard';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { User } from './users/entities/user.entity';
import { Operation } from './operations/entities/operation.entity';
import { Record } from './records/entities/record.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      ...dataSourceOptions,
      entities: [User, Operation, Record],
    }),
    ThrottlerModule.forRoot({
      ttl: 60,
      limit: 10,
    }),
    JwtModule,
    UsersModule,
    OperationsModule,
    RecordsModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: ExceptionToHttpExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: DuplicateKeyExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
