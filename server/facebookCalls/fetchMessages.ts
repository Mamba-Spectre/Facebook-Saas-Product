import axios from "axios";
import MessageModel, { ConversationModel, IConversation } from "../db/messages";
import { sendReplyToFacebook } from "./sendMessage";
import moment from "moment";
import { UserModel } from "../db/users";

let accessToken:any = "";
const getUserBySessionToken = async (sessionToken: string) => {
  try {
    const user = await UserModel.findOne({ 'authentication.sessionToken': sessionToken });
    accessToken = user?.facebookAuthTokens;
  } catch (error) {
    console.error("Error fetching user by session token:", error);
  }
};


export const allConversations = async (req: any, res: any) => {
  try {
    const sessionToken:any = req.headers['common-auth'];

    await getUserBySessionToken(sessionToken);
    
    const about = await axios.get(`https://graph.facebook.com/v19.0/me`, {
      params: {
        access_token: accessToken,
        fields: "name",
      },
    });
    
    
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/me/conversations`,
      {
        params: {
          access_token: accessToken,
          fields: "id,snippet,updated_time,senders",
        },
      }
    );
    
    const conversationsFromApi = response?.data?.data;

    for (const conversation of conversationsFromApi) {
      const existingConversation = await ConversationModel.findOne({
        conversationId: conversation.id,
      });

      if (existingConversation) {
        if (existingConversation.snippet !== conversation.snippet) {
          await ConversationModel.updateOne(
            { conversationId: conversation.id },
            {
              $set: {
                snippet: conversation.snippet,
                time: conversation.updated_time,
              },
            }
          );
        }
      } else {
        await ConversationModel.create({
          pageName: about.data.name,
          conversationId: conversation.id,
          senderName: conversation.senders.data[0].name,
          snippet: conversation.snippet,
          time: conversation.updated_time,
        });
      }
    }
    const twentyFourHoursAgo = moment().subtract(24, "hours").toDate();
    const filteredConversations = await ConversationModel.find({
      time: { $gte: twentyFourHoursAgo },
    });

    return res
      .status(200)
      .json({ allConversationsFromDB: filteredConversations });
  } catch (error) {
    console.log("Error fetching conversations:", error);
    
    return res.status(400).json({ message: "Error fetching conversations" });
  }
};

export const fullConversation = async (req: any, res: any) => {
  try {
    const { conversationId } = req.query;
    const response = await axios.get(
      `https://graph.facebook.com/v19.0/${conversationId}/messages`,
      {
        params: {
          access_token: accessToken,
          fields: "from,to,message,sender,created_time,id",
        },
      }
    );
    console.log("here");
    

    const newMessages = response.data.data;

    let conversation = await MessageModel.findOne({ conversationId });

    if (!conversation) {
      conversation = await MessageModel.create({
        conversationId,
        messages: newMessages,
      });
      return res.status(200).json({ messages: conversation.messages });
    }
    const existingMessageIds = conversation.messages.map(
      (message) => message.id
    );
    const newMessageIds = newMessages.map((message: { id: any }) => message.id);
    const areMessagesDifferent =
      JSON.stringify(existingMessageIds) !== JSON.stringify(newMessageIds);

    if (areMessagesDifferent) {
      conversation.messages = newMessages;
      await conversation.save();
    }

    return res.status(200).json({ messages: conversation.messages });
  } catch (error) {
    return res
      .status(400)
      .json({ message: "Error fetching full conversation" });
  }
};
export const sendReply = async (req: any, res: any) => {
  try {
    const { recieverId, message } = req.body;

    await sendReplyToFacebook(accessToken,recieverId, message);
    return res.status(200).json({ message: "Reply sent successfully" });
  } catch (error) {
    return res.status(400).json({ message: "Error sending reply" });
  }
};
