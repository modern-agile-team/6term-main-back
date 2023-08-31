import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { Chat } from "./chat.schemas";

const options: SchemaOptions = {
    collection: 'ChatNotification',
    timestamps: true,
};

@Schema(options)
export class ChatNotification {
    
    @Prop({ type: mongoose.Types.ObjectId, ref: Chat.name })
    chat_id: mongoose.Types.ObjectId;
    
}

export const ChatNotificationSchema = SchemaFactory.createForClass(ChatNotification);