export class ExpiredTokenException extends Error {
  constructor(message?: string) {
    super(message);
  }
}
