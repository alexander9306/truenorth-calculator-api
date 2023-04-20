import {
  ArgumentsHost,
  Catch,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { InsufficientBalanceException } from '../exceptions/insufficient-balance.exception';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';

@Catch()
export class ExceptionToHttpExceptionFilter extends BaseExceptionFilter {
  public catch(exception: any, host: ArgumentsHost) {
    let handledException: any;

    switch (exception.constructor) {
      case InsufficientBalanceException:
        handledException = new ForbiddenException(
          'Insufficient balance to perform this operation',
        );
        break;
      case InvalidCredentialsException:
        handledException = new UnauthorizedException(
          'Invalid username or password',
        );
        break;
      default:
        handledException = exception;
    }

    super.catch(handledException, host);
  }
}
