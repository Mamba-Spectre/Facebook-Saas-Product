import mongoose, {Schema} from 'mongoose';

interface IMessage extends Document {
  conversationId: string;
  messages: {
    id: string;
    from: {
      name: string;
      email: string;
      id: string;
    };
    to: {
      data: {
        name: string;
        email: string;
        id: string;
      }[];
    };
    message: string;
    created_time: Date;
  }[];
}

const MessageSchema: Schema = new Schema({
  conversationId: { type: String, required: true },
  messages: [{
    id: { type: String, required: true },
    from: {
      name: { type: String, required: true },
      email: { type: String, required: true },
      id: { type: String, required: true }
    },
    to: {
      data: [{
        name: { type: String, required: true },
        email: { type: String, required: true },
        id: { type: String, required: true }
      }]
    },
    message: { type: String, required: true },
    created_time: { type: Date, required: true }
  }]
});
const MessageModel = mongoose.model<IMessage>('Message', MessageSchema);

export default MessageModel;

interface IConversation extends Document {
  isRead:string;
  pageName: string;
    conversationId: string;
    senderName: string;
    snippet: string;
    time: Date;
  }
  const ConversationSchema: Schema = new Schema({
    conversationId: { type: String, required: true, unique: true },
    isRead: { type: String, required: true, default: true},
    senderName: { type: String, required: false },
    snippet: { type: String, required: true },
    time: { type: Date, required: true },
    pageName: { type: String, required: true },
  });
  
  const ConversationModel = mongoose.model<IConversation>('Conversation', ConversationSchema);
  
  export { ConversationModel, IConversation };