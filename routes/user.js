const express = require('express');
const router = require('express-promise-router')()

const userController = require('../controllers/users')
const passport = require('passport')
const passportConfig = require('../middlewares/passport')

const {validateParam, schemas, validateBody} = require('../helpers/routerHelpers')
router.route('/')
    .get(userController.index)
    .post(userController.newUser)

router.route('/auth/google').post(passport.authenticate('google-plus-token',{session:false}),userController.authGoogle)    

router.route('/signup').post(userController.signUp)

router.route('/signin').post(passport.authenticate('local',{session:false}),userController.signIn)

router.route('/secret').get(passport.authenticate('jwt', { session: false }),userController.seCret)

router.route('/:userID')
    .get(validateParam(schemas.idSchema),userController.getUser)
    .put(userController.replaceUser)
    .patch(userController.updateUser)
    

router.route('/:userID/decks')
    .get(userController.getUserDecks)
    .post(userController.newUserDecks)
    
module.exports = router