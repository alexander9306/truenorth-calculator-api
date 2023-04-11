import { ArgumentsHost, Catch, ForbiddenException } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';
import { CustomError } from '../custom-error';

@Catch(CustomError)
export class CustomErrorFilter extends BaseExceptionFilter {
  public catch(exception: CustomError, host: ArgumentsHost) {
    const type = exception.type;

    let handledException: any = exception;

    switch (type) {
      case 'INSUFFICIENT_BALANCE':
        handledException = new ForbiddenException(
          'Insufficient balance to perform this operation',
        );
    }

    super.catch(handledException, host);
  }
}
