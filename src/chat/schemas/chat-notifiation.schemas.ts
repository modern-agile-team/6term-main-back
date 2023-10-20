import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Chat } from './chat.schemas';
import { IsBoolean, IsMongoId, IsNotEmpty, IsNumber } from 'class-validator';

const options: SchemaOptions = {
  collection: 'ChatNotification',
  timestamps: true,
};

@Schema(options)
export class ChatNotification {
  @IsMongoId()
  @IsNotEmpty()
  @Prop({ type: mongoose.Types.ObjectId, ref: Chat.name })
  chat_id: mongoose.Types.ObjectId;

  @IsNumber()
  @IsNotEmpty()
  @Prop({ required: true })
  sender: number;

  @IsNumber()
  @IsNotEmpty()
  @Prop({ required: true })
  receiver: number;

  @IsBoolean()
  @IsNotEmpty()
  @Prop({ required: true, default: false })
  isSeen: boolean;
}

export const ChatNotificationSchema =
  SchemaFactory.createForClass(ChatNotification);