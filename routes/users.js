const express = require('express')
const router = express.Router()
// const requireAuth = require('../middleware/requireAuth')

//contoller functions
const { signupUser, loginUser, ratingUser } = require('../controllers/userController')


// login route
router.post('/login', loginUser)


// signup route
router.post('/signup', signupUser) 

//<-----Middleware for protecting routes---->//
// router.use(requireAuth)

// // rate route
// router.patch('/rate', ratingUser)



module.exports = router