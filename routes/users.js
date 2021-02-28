
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

router.get('/settings', isValidUser,async function(req,res,next){
  let user = await User.findOne({_id:req.user._id})
  let preference = ''
  for (let i =0; i < user.preferences.length; i++){
    preference = preference + user.preferences[i] +"|"
  }
  res.render('settings',{user, preference})
})

// Get Vision Bot
router.get('/vision', async function(req,res,next){
  let user = await User.findOne({_id:req.user._id})
  res.render('vision',{user})
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

router.get('/profile/:id',isValidUser, async function(req,res,next){
  let id = req.params.id
  let user = await User.findOne({_id:id})
  let posts = await Post.find({userid:id})
  res.render('profile',{user, posts})
  console.log(posts)
})

router.get('/upload',isValidUser, async function(req,res,next){
  let user = await User.findOne({_id:req.user._id})
  
  res.render('upload',{user})
})

router.post('/upload', async function(req,res,next){
    let books = req.body.books.split(",")
    let blognames = req.body.blognames.split(",")
    let blogs = req.body.blogs.split(",")
    let videonames = req.body.videonames.split(",")
    let videos = req.body.videos.split(",")
    let userid = req.body.userid
  var post= new Post({
    name:req.body.name,
    title:req.body.title,
    userid:req.body.userid,
    books: books,
    blogs: blogs,
    blognames: blognames,
    videos: videos,
    videonames: videonames
  });
  try{
    doc=await post.save()
    return res.redirect(`/users/profile/${userid}`)
    //return res.status(201).json(doc);
  }
  catch(err){
    return res.redirect('/upload')
    //return res.status(501).json(err);
  }
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
router.get('/nexus',isValidUser, async function(req,res,next){
  let user = await User.findOne({_id:req.user._id})
  let posts = await Post.find()
  console.log(posts)
  
  res.render('nexus',{user,posts})
})

module.exports = router;

