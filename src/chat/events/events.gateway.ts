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
    const chat = postChatDto.hasOwnProperty('imageUrl')
      ? await this.chatService.createChat(postChatDto)
      : await this.chatService.createChatImage(postChatDto);
    socket.to(postChatDto.roomId.toString()).emit('message', chat);
  }

  afterInit(server: Server): any {
    console.log('websocketserver init');
  }

  handleConnection(@ConnectedSocket() socket: Socket): any {
    console.log('connected', socket.nsp.name);
    socket.emit('hello', socket.nsp.name);
  }

  handleDisconnect(@ConnectedSocket() socket: Socket): any {
    console.log('disconnected', socket.nsp.name);
  }
}
