import { ExecutionContext, createParamDecorator } from '@nestjs/common';

export const Users = createParamDecorator(
  (data: unknown, ctx: ExecutionContext) => {
    const socket = ctx.switchToWs().getClient().handshake;
    return socket;
  },
);
