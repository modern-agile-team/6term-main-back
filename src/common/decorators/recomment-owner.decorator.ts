import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const ReCommentOwner = createParamDecorator(
  (data, ctx: ExecutionContext): number => {
    const req = ctx.switchToHttp().getRequest();

    return req.recommentOwner;
  },
);
