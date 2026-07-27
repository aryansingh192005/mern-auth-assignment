const jwt=require("jsonwebtoken");

module.exports=(req,res,next)=>{

const auth=req.headers.authorization;

if(!auth){

return res.status(401).json({
message:"Unauthorized"
});

}

const token=auth.split(" ")[1];

try{

const decoded=jwt.verify(
token,
process.env.ACCESS_TOKEN_SECRET
);

req.user=decoded;

next();

}catch(err){

return res.status(401).json({
message:"Token Invalid"
});

}

}
