import { Conversation } from "../models/conversationModel.js";
import { Message } from "../models/messageModel.js";
import { getReceiverSocketId, io } from "../socket/socket.js";


// send message
export const sendMessage = async (req, res) => {
    try {
        const senderId = req.id;
        const receiverId = req.params.id;
        const {message} = req.body;

        let gotConversation = await Conversation.findOne({
            participants: {$all : [senderId, receiverId]},
        });

        if(!gotConversation){
            gotConversation = await Conversation.create({
                participants: [senderId, receiverId]
            })
        };

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message
        })

        if(newMessage){
            gotConversation.messages.push(newMessage._id);
        }

        await Promise.all([gotConversation.save(), newMessage.save()]);

        //SOCKET IO
        const receiverSocketId = getReceiverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }
        
        return res.status(201).json({
            newMessage,
            success: true,
        })
    } catch (error) {
        console.log(error);
    }


}




// get messages
export const getMessage = async (req, res) => {
    try {
        const senderID = req.id;
        const receiverId = req.params.id;
        
        const conversation = await Conversation.findOne({
            participants: {$all: [senderID, receiverId]},     
        }).populate("messages");
    
        return res.status(200).json(conversation?.messages);
    } catch (error) {
        console.log(error);
    }
}