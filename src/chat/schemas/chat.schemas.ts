import { Prop, Schema, SchemaFactory, SchemaOptions } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { ChatRoom } from "./chat-room.schemas";

const options: SchemaOptions = {
    collection: 'Chat',
    timestamps: true,
};

@Schema(options)
export class Chat {
    
    @Prop({ type: mongoose.Types.ObjectId, ref: ChatRoom.name })
    chatroom_id: mongoose.Types.ObjectId;

    @Prop({ required: true })
    sender: number;

    @Prop({ required: true })
    receiver: number;

    @Prop({ required: true })
    content: string;
    
}

export const ChatSchema = SchemaFactory.createForClass(Chat);