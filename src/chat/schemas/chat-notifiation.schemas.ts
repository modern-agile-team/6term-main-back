import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';
import * as mongoose from 'mongoose';
import { Chat } from './chat.schemas';
import { IsBoolean, IsMongoId, IsNumber } from 'class-validator';

const options: SchemaOptions = {
  collection: 'ChatNotification',
  timestamps: true,
};

@Schema(options)
export class ChatNotification {
  @IsMongoId()
  @Prop({ type: mongoose.Types.ObjectId, ref: Chat.name })
  chat_id: mongoose.Types.ObjectId;

  @IsNumber()
  @Prop({ required: true })
  sender: number;

  @IsNumber()
  @Prop({ required: true })
  receiver: number;

  @IsBoolean()
  @Prop({ required: true, default: false })
  isSeen: boolean;

  @Prop({ type: Date, default: null })
  deleted_at: Date | null;
}

export const ChatNotificationSchema =
  SchemaFactory.createForClass(ChatNotification);
