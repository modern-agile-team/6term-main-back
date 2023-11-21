import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const CommentOwner = createParamDecorator(
  (data, ctx: ExecutionContext): number => {
    const req = ctx.switchToHttp().getRequest();

    return req.commentOwner;
  },
);
