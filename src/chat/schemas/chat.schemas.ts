import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ChatRoom } from './chat-room.schemas';
import { IsBoolean, IsMongoId, IsNumber, IsString } from 'class-validator';

const options: SchemaOptions = {
  collection: 'Chat',
};

@Schema(options)
export class Chat {
  @IsMongoId()
  @Prop({ type: mongoose.Types.ObjectId, ref: ChatRoom.name })
  chatroom_id: mongoose.Types.ObjectId;

  @IsNumber()
  @Prop({ required: true })
  sender: number;

  @IsNumber()
  @Prop({ required: true })
  receiver: number;

  @IsString()
  @Prop({ required: true })
  content: string;

  @IsBoolean()
  @Prop({ required: true, default: false })
  isSeen: boolean;

  @Prop({ default: Date.now }) // 현재 시간을 기본값으로 설정
  createdAt: Date;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
