
const User = require('../models/UserModel')
const Deck = require('../models/DeckModel')
const Joi = require('@hapi/joi')

const JWT = require('jsonwebtoken')
const {JWT_SECRET}  = require('../configs')



const encodeToken = (userID) => {
  return JWT.sign({
    iss: 'Thao Quang',
    sub: userID,
    iat: new Date().getTime(),
    exp: new Date().setDate(new Date().getDate() + 3)
  }, JWT_SECRET)
}
const idSchema = Joi.object().keys({
    userID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required()
})

const authGoogle = async(req,res,next) => {
  const token = encodeToken(newUser._id)

  res.setHeader('Authorization', token)
  return res.status(201).json({success: true})
}

const getUser  = async (req, res, next) => {

    const {userID} = req.params

    const user = await User.findById(userID)
    return res.status(200).json({user})
}

const getUserDecks = async (req, res, next) => {
    const validatorResult = idSchema.validate(req.params) 
    
    const {userID} = req.params

    // Get user 
    const user = await User.findById(userID).populate('decks');

    return res.status(200).json({decks: user.decks})
}

const replaceUser = async (req, res, next) => {
    // enforce new user to old user
    const {userID} = req.params

    const newUser = req.body

    const result = await User.findByIdAndUpdate(userID, newUser)

    return res.status(200).json({user:result})
}

const updateUser = async (req, res, next) => {
    // number of fields 
    const {userID} = req.params

    const newUser = req.body

    const result = await User.findByIdAndUpdate(userID, newUser)

    return res.status(200).json({user:result})
}

const index = async (req, res, next) => {
        const users = await User.find({})
        return res.status(200).json({users})
}

const newUser = async(req,res,next) => {
        console.log("req body " + req.body)
        const newUser = new User(req.body)
        await newUser.save()
        return res.status(200).json({user: newUser})   
}

const newUserDecks = async (req, res, next) => {
    const {userID} = req.params
    // Create a new deck  
    const newDeck = new Deck(req.body)

    // Get user 
    const user = await User.findById(userID)

    // Assign user as a deck's owner 
    newDeck.owner = user

    // save the deck
    await newDeck.save()

    //Add deck to user's decks array decks
    user.decks.push(newDeck)

    // save the user 
    await user.save()

    res.status(201).json({deck: newDeck})
}

const signUp = async (req, res, next) => {
  const {firstName, lastName, email,password} =  req.body

  //check user first
  const foundUser = await User.findOne({email})

  if(foundUser) return res.status(403).json({error: {message: 'Email is already use'}})
  //create a new User object
  const newUser  = new User({firstName,lastName,email,password})

  newUser.save()
  // encode token 
  const token = encodeToken(newUser._id)

  res.setHeader('Authorization', token)
  return res.status(201).json({success: true})

}

const signIn = async (req, res, next) => {
    const token = encodeToken(req.user._id);

    res.setHeader('Authorization', token);
    return res.status(200).json({success: true})
}

const seCret = async (req, res, next) => {
    return res.status(200).json({resources: true})
}

module.exports = {
    index,
    newUser,
    newUserDecks,
    getUser,
    getUserDecks,
    replaceUser,
    updateUser,
    signUp,
    signIn,
    seCret,
    authGoogle
}