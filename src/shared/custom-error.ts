type ErrorTypes = 'INSUFFICIENT_BALANCE';

export class CustomError extends Error {
  type: ErrorTypes;

  constructor(type: ErrorTypes, message?: string) {
    super(message);
    this.type = type;
  }
}
