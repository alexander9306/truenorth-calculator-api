import {
  ArgumentsHost,
  Catch,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { QueryFailedError } from 'typeorm';

@Catch(QueryFailedError)
export class DuplicateKeyExceptionFilter extends BaseExceptionFilter {
  public catch(exception: any, host: ArgumentsHost) {
    const detail = exception.message;

    let handledException = exception;

    if (typeof detail === 'string' && detail.includes('UNIQUE')) {
      const messageStart = exception.message.split('.')[1];
      const errorMessage = `Duplicate key error: ${messageStart} already exists`;

      handledException = new HttpException(errorMessage, HttpStatus.CONFLICT);
    }
    super.catch(handledException, host);
  }
}
