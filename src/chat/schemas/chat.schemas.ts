import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { ChatRoom } from './chat-room.schemas';
import { IsMongoId, IsNotEmpty, IsNumber, IsString } from 'class-validator';

const options: SchemaOptions = {
  collection: 'Chat',
  timestamps: true,
};

@Schema(options)
export class Chat {
  @IsMongoId()
  @IsNotEmpty()
  @Prop({ type: mongoose.Types.ObjectId, ref: ChatRoom.name })
  chatroom_id: mongoose.Types.ObjectId;

  @IsNumber()
  @IsNotEmpty()
  @Prop({ required: true })
  sender: number;

  @IsNumber()
  @IsNotEmpty()
  @Prop({ required: true })
  receiver: number;

  @IsString()
  @IsNotEmpty()
  @Prop({ required: true })
  content: string;
}

export const ChatSchema = SchemaFactory.createForClass(Chat);
