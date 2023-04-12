import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersModule } from './users/users.module';
import { OperationsModule } from './operations/operations.module';
import { RecordsModule } from './records/records.module';
import { User } from './users/entities/user.entity';
import { Operation } from './operations/entities/operation.entity';
import { Record } from './records/entities/record.entity';
import { DuplicateKeyExceptionFilter } from './errors/filters/duplicate-key-exception.filter';
import { ExceptionToHttpExceptionFilter } from './errors/filters/exception-to-http-exception.filter';
import { AuthModule } from './auth/auth.module';
import { AuthGuard } from './auth/auth.guard';
import { JwtModule } from '@nestjs/jwt';

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
    JwtModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (configService: ConfigService) => ({
        global: true,
        secret: configService.get<string>('SECRET_KEY') || 'MySecretKey',
        signOptions: { expiresIn: '1h' },
      }),
      inject: [ConfigService],
    }),
    UsersModule,
    OperationsModule,
    RecordsModule,
    AuthModule,
  ],
  providers: [
    {
      provide: APP_FILTER,
      useClass: DuplicateKeyExceptionFilter,
    },
    {
      provide: APP_FILTER,
      useClass: ExceptionToHttpExceptionFilter,
    },
    {
      provide: APP_GUARD,
      useClass: AuthGuard,
    },
  ],
})
export class AppModule {}
