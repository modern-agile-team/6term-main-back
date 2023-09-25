import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { onlineMap } from './onlineMap';
import mongoose from 'mongoose';

// @WebSocketGateway({ namespace: /\/ch\d+/ })
@WebSocketGateway({ namespace: '/ch123' })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() public server: Server;

  @SubscribeMessage('test')
  handleTest(@MessageBody() data: string) {
    console.log('test', data);
  }

  @SubscribeMessage('login')
  handleLogin(
    @MessageBody() data: { id: number; channels: number[] },
    @ConnectedSocket() socket: Socket,
  ) {
    const userName = data.id;
    const rooms = data.channels;
    console.log('login', userName);
    rooms.forEach((channels: number) => {
      console.log('join', channels);
      socket.join(`${channels}`);
    });
  }

  afterInit(server: Server): any {
    console.log('websocketserver init');
  }

  handleConnection(@ConnectedSocket() socket: Socket): any {
    console.log('connected', socket.nsp.name);
    socket.on('message', (chat) => {
      console.log('Received new chat message:', chat);
    });
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): any {
    console.log('disconnected', socket.nsp.name);
  }
}
