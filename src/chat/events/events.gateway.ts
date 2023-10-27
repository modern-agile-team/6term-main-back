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
import { ChatService } from 'src/chat/services/chat.service';
import { PostChatDto } from '../dto/post-chat.dto';
import { AsyncApiSub } from 'nestjs-asyncapi';
import { UseFilters, UsePipes, ValidationPipe } from '@nestjs/common';
import { LoginChatRoomDto } from '../dto/login-chat-room.dto';
import { WebSocketExceptionFilter } from '../exceptions/websocket-exception.filter';

@WebSocketGateway({ namespace: /\/ch-.+/, cors: true })
@UsePipes(ValidationPipe)
@UseFilters(WebSocketExceptionFilter)
export class EventsGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private chatService: ChatService) {}
  @WebSocketServer() public server: Server;

  @SubscribeMessage('test')
  handleTest(@MessageBody() data: string) {
    console.log('test', data);
  }

  @AsyncApiSub({
    description: `
    socket.join
    유저가 속한 chat_room의 id를 토대로
    소켓 룸으로 join`,
    channel: 'login',
    message: {
      payload: LoginChatRoomDto,
    },
  })
  @SubscribeMessage('login')
  handleLogin(
    @MessageBody() loginChatRoomDto: LoginChatRoomDto,
    @ConnectedSocket() socket: Socket,
  ) {
    console.log('login', loginChatRoomDto.userId);
    loginChatRoomDto.rooms.forEach((room) => {
      console.log('join', socket.nsp.name, room);
      socket.join(room.toString());
    });
  }

  @AsyncApiSub({
    description: `
    채팅 전송
    리턴 값
    {
      content: 채팅내용,
      sender: 보낸 사람 id,
      receiver: 받는 사람 id,
    };
    `,
    channel: 'message',
    message: {
      payload: PostChatDto,
    },
  })
  @SubscribeMessage('message')
  async handleMessage(
    @MessageBody() postChatDto: PostChatDto,
    @ConnectedSocket() socket: Socket,
  ) {
    const chat = await this.chatService.createChat(postChatDto);
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
