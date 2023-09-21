import { Prop, Schema, SchemaFactory, SchemaOptions } from '@nestjs/mongoose';

const options: SchemaOptions = {
  collection: 'ChatRoom',
  timestamps: true,
};

@Schema(options)
export class ChatRoom {
  @Prop({ required: true })
  host_id: number;

  @Prop({ required: true })
  guest_id: number;

  @Prop({ type: Date, default: null })
  deleted_at: Date | null;
}

export const ChatRoomSchema = SchemaFactory.createForClass(ChatRoom);
