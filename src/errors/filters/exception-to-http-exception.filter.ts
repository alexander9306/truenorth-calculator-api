import {
  ArgumentsHost,
  Catch,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { InsufficientBalanceException } from '../exceptions/insufficient-balance.exception';
import { InvalidCredentialsException } from '../exceptions/invalid-credentials.exception';
import { InvalidTokenException } from '../exceptions/invalid-token.exception';
import { ExpiredTokenException } from '../exceptions/expired-token.exception';

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
      case InvalidTokenException:
        handledException = new UnauthorizedException('Invalid token');
        break;
      case ExpiredTokenException:
        handledException = new ForbiddenException('Token has expired');
        break;
      default:
        handledException = exception;
    }

    super.catch(handledException, host);
  }
}
