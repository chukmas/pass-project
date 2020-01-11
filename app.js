if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config()
}
const express = require("express")
const app = express()
const index = require("./routes/index")
const users = require("./routes/users")
const expressLayouts = require("express-ejs-layouts")
const mongoose = require("mongoose")
const flash = require("connect-flash")
const session = require("express-session")
const passport = require("passport")
// require("dotenv/config")
require("./config/passport")(passport);

app.use(expressLayouts)
app.set("view engine","ejs")
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized: true
  }))
  app.use(flash())
  //passport middleware
app.use(passport.initialize());
app.use(passport.session());
  // Global variables
app.use(function(req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');

    next();
  });


app.use("/", index)
app.use("/", users)

mongoose.connect(process.env.DATABASE_URL,{ useNewUrlParser: true,useUnifiedTopology: true},
(err)=>{
    if(!err){console.log("connected to database")}
    else{console.log("an error occured" + err)}
})

const PORT = process.env.PORT || 3000;

app.listen(PORT, ()=>console.log(`server running on port ${PORT}`))
