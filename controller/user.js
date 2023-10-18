const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const {sendMail} = require("../services/sendMails");

const secret = "$ecretKey"

const getLogin = (req, res) => {
  res.render("login");
};
const postLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    const currUser = await User.findOne({ username });
    if (currUser) {
      const isValid = await bcrypt.compare(password, currUser.password);
      if (isValid) {
        const token = jwt.sign({ userId: currUser._id, username: currUser.username }, secret);
        return res.status(200).cookie("token",token).redirect("/user/dashboard");
      } else {
        res.render("login", { message: "Invalid Credentials" });
      }
    } else {
        res.render("login", { message: "User does not exist" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
};
const getRegister = (req, res) => {
  res.render("register");
};
const postRegister = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
        return res.status(400).render("register", { message: "All fields are required" });
    }
    const currUser = await User.findOne({ username });
    if (currUser) {
      return res.status(400).render("register", { message: "User already exists" });
    }
    const hashPassword = await bcrypt.hash(password, 10);
    const user = await User.create({
      username,
      email,
      password: hashPassword,
    });
    const token = jwt.sign({ userId: user._id, username: user.username }, secret);
    return res.status(200).cookie("token",token).redirect("/user/dashboard");
  } catch (error) {
    if (error.code === 11000) {
        // MongoDB duplicate key error (code 11000)
        return res.status(400).render("register", { message: "User already exists" });
      } else {
        // Handle other errors gracefully
        console.error(error);
        return res.status(500).render("error", { message: "Internal Server Error" });
    }
  }
};

const getLogout = (req, res) => {
    res.clearCookie("token").redirect("login");
};


const getForgotPassword = (req, res) => {
    return res.render("forgotPassword");
}

const postForgotPassword = async(req, res) => {
  const {email} = req.body;
  const user = await User.findOne({email});
  if(!user){
    return res.status(400).render("forgotPassword", {message:"User does not exist"});
  }
  const token = jwt.sign({userId:user._id, userEmail:user.email}, secret, {expiresIn:"10m"});
  const link = `http://localhost:5000/user/reset-password/${token}`;
  await sendMail(user.email, link).then(console.log("email sent successfully"));
  res.render("forgotPassword", {message:"Password reset link has been sent to your email"});
}

const getResetPassword = async(req, res) => {
  const {token} = req.params;
  const decoded = jwt.verify(token, secret);
  const user = await User.findById(decoded.userId);
  if(!user){
    return res.status(400).render("error", {message:"User does not exist"});
  }
  return res.render("resetPassword");
}

const postResetPassword = async(req, res) => {
  const {password, confirmPassword} = req.body;
  const token = req.params.token;
  if(password !== confirmPassword){
    return res.render("resetPassword", {message:"Passwords do not match"});
  }
  try{
    const decoded = jwt.verify(token, secret);
    const user = await User.findById(decoded.userId);
    const hashPassword = await bcrypt.hash(password, 10);
    user.password = hashPassword;
    await user.save();
    return res.render("home", {message:"Password reset successful"});
  }
  catch(error){
    console.error(error);
    return res.status(500).render("error", {message:"Internal Server Error"});
  }
}

const getDashboard = async(req, res) => {
    const username = req.username;
    // console.log(username);
    const email = await User.findOne({username}).select("email");
    res.render("dashboard", {username:username, email:email.email});
};

module.exports = {
  getLogin,
  postLogin,
  getRegister,
  postRegister,
  getLogout,
  getForgotPassword,
  postForgotPassword,
  getResetPassword,
  postResetPassword,
  getDashboard
};
