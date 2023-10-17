import { HttpException, HttpStatus } from '@nestjs/common';

export class AuthException extends HttpException {
  constructor(
    message: string,
    statusCode: HttpStatus = HttpStatus.BAD_REQUEST,
  ) {
    super(
      {
        statusCode: statusCode,
        message: [message],
        error: HttpStatus[statusCode],
      },
      statusCode,
    );
  }
}
