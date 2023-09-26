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
import { User } from 'src/users/entities/user.entity';

@WebSocketGateway({ namespace: /\/ch\d+/, cors: true })
// @WebSocketGateway({ namespace: '/ch123' })
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
    // @MessageBody() data: { id: number; roomId: number[] },
    @MessageBody() data: { id: string; channel: string },
    @ConnectedSocket() socket: Socket,
  ) {
    const userName = data.id;
    // const rooms = data.roomId;
    const rooms = data.channel;
    console.log('login', userName);
    console.log('join', rooms);
    socket.join(`${rooms}`);
    // rooms.forEach((channels: number) => {
    //   console.log('join', channels);
    //   socket.join(`${channel}`);
    // });
  }

  afterInit(server: Server): any {
    console.log('websocketserver init');
  }

  handleConnection(@ConnectedSocket() socket: Socket): any {
    console.log('connected', socket.nsp.name);
    socket.emit('hello', socket.nsp.name);
    socket.on('login', (data) => {
      const userName = data.id;
      socket.data.userName = userName;
    });
    socket.on('message', (chat) => {
      console.log('Received new chat message:', chat);
      const userName = socket.data.userName;
      socket.broadcast.emit('msgNoti', `${userName}의 message: ${chat}`);
    });
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): any {
    console.log('disconnected', socket.nsp.name);
  }
}
