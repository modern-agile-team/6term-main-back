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
import mongoose from 'mongoose';
import { ChatService } from 'src/chat/services/chat.service';
import { PostChatDto } from '../dto/post-chat.dto';

@WebSocketGateway({ namespace: /\/ch-.+/, cors: true })
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private chatService: ChatService) {}
  @WebSocketServer() public server: Server;

  @SubscribeMessage('test')
  handleTest(@MessageBody() data: string) {
    console.log('test', data);
  }

  @SubscribeMessage('login')
  handleLogin(
    @MessageBody() data: { id: number; rooms: mongoose.Types.ObjectId[] },
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('login', data.id);
    data.rooms.forEach((room) => {
      console.log('join', socket.nsp.name, room);
      socket.join(room.toString());
    });
  }

  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() postChatDto: PostChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const chat = await this.chatService.createChat(postChatDto, socket);
    socket.to(postChatDto.roomId.toString()).emit('message', chat);
    return chat;
    // this.chats;
    // const socketRoomId = data.roomId;
    // console.log(data.roomId);
    // socket.to(socketRoomId).emit('message', '설마성공?', data.message);
    // this.server.to(socketRoomId).emit('message', '설마성공?', data.message);
  }

  afterInit(server: Server): any {
    console.log('websocketserver init');
  }

  handleConnection(@ConnectedSocket() socket: Socket): any {
    console.log('connected', socket.nsp.name);
    socket.emit('hello', socket.nsp.name);
    socket.on('hello', (data) => {
      console.log(data);
    });
    socket.on('login', (data) => {
      const userName = data.id;
      socket.data.userName = userName;
    });
    socket.on('asdf', (data) => {
      console.log(data);
      socket.to(`/ch-${socket.nsp.name}`).emit('message', data);
    });
    socket.on('notification', () => {});
    socket.on('message', (data) => {
      const userId = data.id;
      const chat = data.message;
      console.log('Received new chat message:', data.message);
      socket.broadcast.emit('msgNoti', `${userId}의 message: ${chat}`);
    });
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): any {
    console.log('disconnected', socket.nsp.name);
  }
}
