const User = require('../model/user');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

exports.register = async (req,res)=>{
    try{
        const {username,email,password} = req.body;

        const ckeckUsername = await User.findOne({username});

        if(ckeckUsername)
        {
            return res.status(400).json({
                success:false,
                message:"Username already exists"
            });
        }

        const ckeckEmail = await User.findOne({email});
        if(ckeckEmail)
        {
            return res.status(401).json({
                success:false,
                message:"Email already exists"
            });
        }

        const hashedPassword = await bcrypt.hash(password,10);

        const user = await User.create({
            username,
            email,
            password:hashedPassword
        })

        delete user.password;

        return res.status(201).json({
            success:true,
            user,
            message:"User created successfully"
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while registering"
        });
    }
}

exports.login = async (req,res)=>{
    try{
        const {username,password} = req.body;
        const user = await User.findOne({username});
        if(!user)
        {
            return res.status(400).json({
                success:false,
                message:"User not found"
            });
        }

        const isMatch = await bcrypt.compare(password,user.password);
        if(!isMatch)
        {
            return res.status(400).json({
                success:false,
                message:"Incorrect password"
            });
        }

        delete user.password;
        return res.status(200).json({
            success:true,
            user,
            message:"User logged in successfully"
        })
    }
    catch(error){
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while logging in"
        });
    }
}


exports.setAvatar = async (req,res)=>{
    try{
        const userId = req.params.id;

        const avatarImage = req.body.image;

        const userData = await User.findByIdAndUpdate(userId,{
            isAvatarImageSet:true,
            avatarImage
        },{new:true});

        return res.status(200).json({
            success:true,
            message:"Avatar set successfully",
            isSet : userData.isAvatarImageSet,
            image:userData.avatarImage
        })
    }
    catch(error)
    {
        console.log(error);
        return res.status(500).json({
            success:false,
            message:"Something went wrong while setting avatar"
        });
    }
}

//get all user for chat
exports.getAllUsers = async (req,res)=>{
    try{
        const users = await User.find( {_id : { $ne : req.params.id }} ).select([
            "username",
            "avatarImage",
            "_id",
            "email"
        ]); 
        return res.status(200).json({
            success:true,
            users
        })
    }
    catch(error)
    {
        console.log(error); 
        return res.status(500).json({
            success:false,
            message:"Something went wrong while getting all users"
        })
    }
}
