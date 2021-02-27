
var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Post = require('../models/post');
const passport = require('passport');
const user = require('../models/user');


router.get('/',isValidUser, async(req,res,next) => {
  let user = await User.findOne({_id:req.user._id})
  res.render('landing',{user})
})

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
// Get Settings Page
router.get('/settings', async function(req,res,next){
  let user = await User.findOne({_id:req.user._id})
  let preference = ''
  for (let i =0; i < user.preferences.length; i++){
    preference = preference + user.preferences[i] +"|"
  }
  res.render('settings',{user, preference})
})


// Get Settings Page
router.post('/settings', async function(req,res,next){
  console.log(req.body.subjectsarray.length)
  const preferences = req.body.subjectsarray
  const arr = preferences.split("|")
  const name = req.body.name
  const password = req.body.password
  if (password){
    await User.findByIdAndUpdate({_id:req.user._id},{
      preferences:arr,
      name: name,
      password:User.hashPassword(password),
    })
    return res.redirect('/users/settings')
  }
  await User.findByIdAndUpdate({_id:req.user._id},{
    preferences:arr,
    name: name,
  })
  return res.redirect('/users/settings')
})

router.get('/profile/:id', async function(req,res,next){
  let id = req.params.id
  let user = await User.findOne({_id:id})
  
  res.render('profile',{user})
})

module.exports = router;

