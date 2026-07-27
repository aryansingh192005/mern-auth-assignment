
const bcrypt = require("bcryptjs");
const User = require("../models/User");

exports.register = async (req,res)=>{
    try{

        const {name,email,password}=req.body;
        if (!name || !email || !password) {
  return res.status(400).json({
    message: "All fields are required"
  });
}

if (password.length < 6) {
  return res.status(400).json({
    message: "Password must be at least 6 characters"
  });
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!emailRegex.test(email)) {
  return res.status(400).json({
    message: "Invalid email address"
  });
}
        const exists=await User.findOne({email});

        if(exists){
            return res.status(400).json({
                message:"User already exists"
            });
        }

        const hashedPassword=await bcrypt.hash(password,10);

        await User.create({
            name,
            email,
            password:hashedPassword
        });

        res.status(201).json({
            message:"Registration Successful"
        });

    }catch(err){

        res.status(500).json({
            message:err.message
        });

    }
}

const jwt=require("jsonwebtoken");
const {
generateAccessToken,
generateRefreshToken
}=require("../utils/generateTokens");

exports.login=async(req,res)=>{

const {email,password}=req.body;
if (!email || !password) {
  return res.status(400).json({
    message: "Email and password are required"
  });
}
const user=await User.findOne({email});

if(!user){
return res.status(401).json({message:"Invalid Credentials"});
}

const valid=await bcrypt.compare(password,user.password);

if(!valid){
return res.status(401).json({message:"Invalid Credentials"});
}

const accessToken=generateAccessToken(user._id);

const refreshToken=generateRefreshToken(user._id);

user.refreshToken=refreshToken;

await user.save();

res.cookie("refreshToken", refreshToken, {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000
});

return res.json({
  accessToken,
  user: {
    id: user._id,
    name: user.name,
    email: user.email
  }
});

}

exports.refreshToken=async(req,res)=>{

const token=req.cookies.refreshToken;

if(!token){

return res.sendStatus(401);

}

try{

const decoded=jwt.verify(
token,
process.env.REFRESH_TOKEN_SECRET
);

const user=await User.findById(decoded.userId);

if(!user||user.refreshToken!==token){

return res.sendStatus(403);

}

const accessToken=generateAccessToken(user._id);

res.json({accessToken});

}catch(err){

res.sendStatus(403);

}

}

exports.logout=async(req,res)=>{

const token=req.cookies.refreshToken;

if(token){

const user=await User.findOne({
refreshToken:token
});

if(user){

user.refreshToken=null;

await user.save();

}

}

res.clearCookie("refreshToken", {
  httpOnly: true,
  sameSite: "lax",
  secure: false
});

res.json({
message:"Logged out"
});

}

exports.dashboard=(req,res)=>{

res.json({

message:"Welcome to Dashboard",

user:req.user

});

}