import { sendReplyToFacebook } from "../facebookCalls/sendMessage";
import MessageModel from "../db/messages";

export const webhookCheck = (req: any, res: any) => {
    console.log('webhookCheck');
    
    const verifyToken = '123';
    console.log(req.query['hub.verify_token']);
    
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];
    if (token === verifyToken) {
        return res.status(200).send(challenge);
    }else{
        return res.status(403).json({message:'Invalid token'});
    }
};
// export const sendReply = async (req: any, res: any, next: any) => {
//     try {
//         const {messageId,content} = req.body;
//         if (!messageId || !content) {
//             return res.sendStatus(400);
//         }
//         const message:any = await MessageModel.findOne({messageId});
//         await sendReplyToFacebook(message.recipientId, content);
//         message.replied = true;
//         await message.save();

//         // Respond with a success message
//         res.status(200).json({ message: 'Reply sent successfully' });
//         if(!message){
//             return res.sendStatus(403).json({message:'Message not found'});
//         }
//     } catch (error) {
//         console.log(error);
//         return res.sendStatus(400);
//     }
// };