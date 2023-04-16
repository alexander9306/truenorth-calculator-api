import { createParamDecorator, ExecutionContext } from '@nestjs/common';

// Custom decorator to extract the userId from the request object
export const UserId = createParamDecorator(
  (data: unknown, context: ExecutionContext) => {
    const request = context.switchToHttp().getRequest();
    const user = request.user;
    return user?.userId;
  },
);
