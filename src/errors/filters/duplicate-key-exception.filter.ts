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
    const detail = exception.detail;

    let handledException = exception;

    if (
      typeof detail === 'string' &&
      exception.message.includes('duplicate key')
    ) {
      const key = detail.split(')=(')[0].split('(')[1];
      const errorMessage = `${key} already exists`;

      handledException = new HttpException(errorMessage, HttpStatus.CONFLICT);
    }
    super.catch(handledException, host);
  }
}
