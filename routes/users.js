const express = require('express')
const router = express.Router()
const {requireAuth} = require('../middleware/requireAuth')

//contoller functions
const { signupUser, loginUser, removeFrom, addToCart, addToFavorites } = require('../controllers/userController')


// login route
router.post('/login', loginUser)


// signup route
router.post('/signup', signupUser) 

//<--------------Middleware for protecting routes--------------->//
router.use(requireAuth)

// add to cart route
router.patch('/addToCart', addToCart) 

// remove from cart or favorites route
router.patch('/removeFrom/:place', removeFrom) 

// add to favorites route
router.patch('/addToFavorites', addToFavorites) 



module.exports = router