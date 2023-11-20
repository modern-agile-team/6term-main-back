import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const BoardOwner = createParamDecorator(
  (data, ctx: ExecutionContext): number => {
    const req = ctx.switchToHttp().getRequest();

    return req.unitowner;
  },
);
