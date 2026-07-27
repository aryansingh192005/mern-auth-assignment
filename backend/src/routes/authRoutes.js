const express=require("express");

const router=express.Router();

const auth=require("../controllers/authController");

const protect=require("../middleware/authMiddleware");

router.post("/register",auth.register);

router.post("/login",auth.login);

router.post("/refresh",auth.refreshToken);

router.post("/logout",auth.logout);

router.get("/dashboard",protect,auth.dashboard);

router.get("/", (req, res) => {
  res.json({
    message: "Auth API is running"
  });
});

module.exports=router;