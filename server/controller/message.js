const Message = require("../model/Message");


exports.addMessage = async (req,res)=>{
    try{
        const { from ,to, message} = req.body;
        const data = await Message.create({
            message:{text:message},
            users:[from,to],
            sender:from
        })

        if(data)
        {
            return res.status(200).json({
                success:true,
                message:"Message added successfully"
            })
        }
        else{
            return res.status(400).json({
                success:false,
                message:"Failed to add message in the database"
            })
        }
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while adding message"
        })
    }
}


exports.getAllMessages = async (req,res)=>{
    try{
        const {from,to} = req.body;
        const messages = await Message.find({
            users:{
                $all:[from,to]
            }
        }).sort({updatedAt:1});

        const projectMessages = messages.map((msg)=>{
            return {
                fromSelf:msg.sender.toString() === from,
                message:msg.message.text
            }
        });

        return res.status(200).json({
            success:true,
            projectMessages
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while getting messages"
        })
    }
}