const express = require('express')
const router = express.Router()
const {requireAuth} = require('../middleware/requireAuth')

//contoller functions
const { signupUser, loginUser, addTo, removeFrom } = require('../controllers/userController')


// login route
router.post('/login', loginUser)


// signup route
router.post('/signup', signupUser) 

//<--------------Middleware for protecting routes--------------->//
router.use(requireAuth)

// add to cart or favorites route
router.patch('/addTo/:place', addTo) 

// remove from cart orfavorites route
router.patch('/removeFrom/:place', removeFrom) 





module.exports = router