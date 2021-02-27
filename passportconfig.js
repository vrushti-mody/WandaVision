var passport = require ('passport'), LocalStratergy = require('passport-local').Strategy ;
var User = require('./models/user')
require('custom-env').env()

passport.use('local',new LocalStratergy({
    usernameField:'email',
    passwordField:'password'
},
    function (username, password, done){
        User.findOne({email:username},function (err,user){
            if(err){ return done(err); }
            if(!user){
                return done(null,false,{message: 'Incorrect username or password'})
            }
            if(!user.isValid(password)){
                return done(null,false,{message: 'Incorrect username or password'})
            }
            return done(null,user)
        })
    }
))

var GoogleStrategy = require('passport-google-oauth2').Strategy;

// Use the GoogleStrategy within Passport.
//   Strategies in passport require a `verify` function, which accept
//   credentials (in this case, a token, tokenSecret, and Google profile), and
//   invoke a callback with a user object.
passport.use('google',new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.CALLBACK_URL
  },
  function(token, tokenSecret, profile, done) {
    //check user table for anyone with a google ID of profile.id
    User.findOne({
        'email': profile.email
    }, function(err, user) {
        if (err) {
            return done(err);
        }
        //No user was found... so create a new user with values from Google (all the profile. stuff)
        if (!user) {
            user = new User({
               
                name: profile.name.givenName,
                email: profile.email,
                password:User.hashPassword('pass@123'),
                createdAt: Date.now(),
                bio:'Hey there! I like to spread good vibes'
               
            });
            user.save(function(err) {
                if (err) console.log(err);
                return done(err, user);
            });
        } else {
            //found user. Return
            return done(err, user);
        }
    });
}
));

passport.serializeUser(function(user, done) {
    done(null, user._id);
  });
  
  passport.deserializeUser(function(_id, done) {
    User.findById(_id, function(err, user) {
      done(err, user);
    });
  });