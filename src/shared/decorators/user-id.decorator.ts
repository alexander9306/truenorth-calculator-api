import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { JwtPayload } from 'src/auth/interfaces/jwt.payload.interface';

// Create a custom decorator to extract the userId from the request object
export const UserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const payload: JwtPayload = request.user;
    return payload?.sub;
  },
);
