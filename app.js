const dotenv = require("dotenv");
dotenv.config();
const express = require("express");
const mongoose = require("mongoose"); 
const cookieParser = require("cookie-parser");
const app = express();
const userRoute = require("./routes/user");
const {redirectToDashboardIfAuthenticated} = require("./middlewares/auth");

const port = process.env.PORT || 3000;

const db = process.env.MONGO_URL;
mongoose.connect(db).then(console.log("DB connected"));

app.set("view engine", "ejs");

app.use(express.urlencoded({extended:false}));
app.use(express.json());
app.use(cookieParser());

app.use("/user", userRoute);
app.use("/",redirectToDashboardIfAuthenticated, (req,res)=>{
    res.render("home");
})

app.listen(port, ()=>{
    console.log(`Server started at port: ${port}`);
})
