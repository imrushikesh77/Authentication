const express = require("express");
const route = express.Router();
const {
    verifyToken, 
    redirectToDashboardIfAuthenticated
} = require("../middlewares/auth");


const {
    getLogin,
    postLogin,
    getRegister,
    postRegister,
    getLogout,
    getDashboard,
    getForgotPassword,
    postForgotPassword,
    getResetPassword,
    postResetPassword
} = require("../controller/user");

route.get("/login",redirectToDashboardIfAuthenticated, getLogin)
route.post("/login", postLogin);
route.get("/register",redirectToDashboardIfAuthenticated, getRegister)
route.post("/register",postRegister);
route.get("/logout", getLogout);
route.get("/forgot-password", getForgotPassword);
route.post("/forgot-password", postForgotPassword);
route.get("/reset-password/:token", getResetPassword);
route.post("/reset-password/:token", postResetPassword);
route.get("/dashboard", verifyToken, getDashboard);
route.get("*", (req,res)=>{
    res.render("error", {message:"Page not found"});
});

module.exports = route;
