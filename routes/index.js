
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Post = require('../models/post');
const passport = require('passport');

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index");
});

// Get register Page
router.get('/register',function(req,res,next){
  
    res.render('signup',{error:''})
 
  
})

//Post Request on Register Page
router.post('/register',function(req,res,next){
  console.log(req.body)
  if (req.body.password!==req.body.cpassword){
    return res.render('signup',{"error":"Passwords dont match"})
  }
  else{
    database(req,res);
  }
  
})

// Save Details to database 
async function database(req,res){
  var user= new User({
    name:req.body.name,
    email:req.body.email,
    password: User.hashPassword(req.body.password),
    createdAt: Date.now(),
    bio: 'Hi there! I am using Wanda'
  });
  try{
    doc=await user.save()
    return res.redirect('/login')
    //return res.status(201).json(doc);
  }
  catch(err){
    return res.render('signup',{"error":"Error saving data! Please try again"})
    //return res.status(501).json(err);
  }
  
}

// Get register Page
router.get('/completeprofile', async function(req,res,next){
  let user = await User.findOne({_id:req.user._id})
  res.render('complete-profile',{user})
})

router.post('/completeprofile',isValidUser, async function(req,res,next){
  const preferences = req.body.subjectsarray
  const arr = preferences.split("|")
  await User.findByIdAndUpdate({_id:req.user._id},{
    preferences:arr,
  })
  console.log(req.body)
  return res.redirect('/users')
})

//Get Login Page
router.get('/login',function(req,res,next){
 
    res.render('login',{error:''})
  
  
})

//Post Request on Login Page
router.post('/login',async function(req,res,next){
  passport.authenticate('local', async function(err,user,info){
    if (err){ return res.render('login',{"error":"Invalid email/password"});}
    if (!user){  return res.render('login',{"error":"Invalid email/password"})}
    req.login(user,async function(err){
      if(err){ return res.status(501).json(err);}
      user = await User.findOne({_id:req.user._id})
      if(user.preferences.length>0){
        return res.redirect('/users')
      }
      return res.redirect('/completeprofile')
    });
  })(req, res, next);
});

router.get('/google', passport.authenticate('google', { scope: ['https://www.googleapis.com/auth/plus.login', 'https://www.googleapis.com/auth/userinfo.email', 'https://www.googleapis.com/auth/userinfo.profile'] }))

router.get('/google/callback', passport.authenticate('google', { failureRedirect: '/err' }), (req, res) => {
  req.login(req.session.passport.user,async function(err){
    if(err){ return res.status(501).json(err);}
    user = await User.findOne({_id:req.user._id})
    console.log(user)
    if(user.preferences.length>0){
      return res.redirect('/users')
    }
    return res.redirect('/completeprofile')
      
      
   
    //return res.status(200).json({message:'Login Successful'});

  });
})

router.get('/logout',isValidUser,function(req,res,next){
  req.logout();
  res.redirect('/')
  //return res.status(200).json({message:'Logout Successful'});
});








/* STUDY ROOM FUNCTIONALITY */
router.get('/chat',isValidUser, async function(req, res, next) {
  user = await User.findOne({_id:req.user._id})
   console.log("JOIN CHAT ROOM")
    res.render('chat', {user});
});



function isValidUser(req,res,next){
  if(req.isAuthenticated()){
    next()
  }
  else{
    console.log('Unauthorized request')
    res.redirect('/login')
  //return res.status(401).json({message:'Unauthorized Request'});
  }
}


module.exports = router;
