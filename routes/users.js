const express = require("express")
const router = express.Router()
const User = require("../models/User")
const bcrypt = require("bcryptjs")
const passport = require("passport")

router.get("/login", (req,res)=>{
    res.render("login")
})

router.get("/register", (req,res)=>{
    res.render("register")   
})
router.post("/register", (req,res)=>{
  const{name,email,password,password2}=req.body;
   let errors = [];
   if(!name || !email || !password || !password2){
    errors.push({ msg:"Please all fields must be filled"})
   }
   if(password !== password2){
       errors.push({msg:"password does not match"})
   }
   if(password.length < 6){
       errors.push({msg:"password must contain at least 6 characters"})
   }
   if(errors.length > 0){
    res.render('register', {
        errors,
        name,
        email,
        password,
        password2
     });   
   }else{
       User.findOne({email:email})
       .then(user=>{
          if(user){
            errors.push({msg:"Email is already registered"})
            res.render("register", {
                errors,
                name,
                email,
                password,
                password2
            })
          }else{
             const newUser = new User({
                 name,
                 email,
                 password,
             })
             //hash password with bcrypt
             bcrypt.genSalt(10, (err, salt)=> bcrypt.hash(newUser.password,salt, (err,hash)=>{
                 if(err) throw err;
                 //set password to hashed
                 newUser.password = hash;
              //save User
               newUser.save()
               .then(user=>{
                   req.flash('success_msg', 'You are now registered')
                   res.redirect("register")
               })
               .catch(err=> console.log(err))

             }))
          }
       })
      
    }   
})

 // Login handle
 router.post("/login", (req,res,next)=>{
  passport.authenticate("local", {
    successRedirect:"/dashboard",
    failureRedirect:"/login",
    failureFlash: true
   })(req, res, next);
 })

  //logout handle
  router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
  });
  

module.exports = router;