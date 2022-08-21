const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy
const {ExtractJwt} = require('passport-jwt')
const {JWT_SECRET, auth} = require('../configs')
const LocalStrategy = require('passport-local')
const GooglePlusTokenStrategy = require('passport-google-plus-token')
const User = require('../models/UserModel')

//passport Jwt
passport.use(new JwtStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken('Authorization'),
  secretOrKey: JWT_SECRET
}, async(payload, done) => {
  try {
    const user = await User.findById(payload.sub)

    if(!user) return done(null,false)

    done(null,user)
  } catch(error){
    done(error,false)
  }
}))

//passport google  
passport.use(new GooglePlusTokenStrategy({
  clientID: auth.google.CLIENT_ID,
  clientSecret : auth.google.CLIENT_SECRET
}, async(accessToken, refreshToken, profile, done) => {
  try {
   // check whether this current user exists in our database 
   const isExistUser = await User.findOne({authGoogleID:profile.id,authType:"google"})

   if(isExistUser) return done(null,isExistUser)

   //if new account 
   const newUser = new User({
    authType: 'google',
    email: profile.emails[0].value, 
    authGoogleID: profile.id
   })

   await newUser.save()
   done(null,newUser)
  } catch(error){
    done(error,false)
  }
}))

// passport local 
passport.use(new LocalStrategy({
  usernameField: 'email',
}, async(email,password,done) =>{
  try{
    const user = await User.findOne({email})

    if(!user ) return done(null,false)

    const isCorrectPassword = await user.isValidPassword(password)

    if(!isCorrectPassword) return done(null,false)

    done(null,user)
  }catch(error){
    done(error,false)
  }
}))