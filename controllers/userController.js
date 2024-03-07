const User = require("../models/userModel");
const Product = require("../models/productModel");
// const jwt = require("jsonwebtoken");

// const createToken = (_id) => {
//   return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
// };

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // extract properties from db
    const { role, category, username, _id } = await User.login(email, password);
    const token = createToken(_id);

    res.status(200).json({ email, token, role, category, username });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  const {
    email,
    password,
    role,
    category,
    username,
    ratingArray,
    ratingNumber,
  } = req.body;

  try {
    const user = await User.signup(
      email,
      password,
      role,
      category,
      username,
      ratingArray,
      ratingNumber
    );
    const token = createToken(user._id);

    res.status(200).json({ email, token, role, category, username });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
const ratingUser = async (req, res) => {
  const { creatorId, payload } = req.body; 
  const payloadUserId = req.user._id.toString();
  console.log("tu sam");
  try {
    // update creator rating and return updated rating number
    const updatedRating = await User.rating(creatorId, payloadUserId, payload);
    

    // find all creator's ads and update rating on those
    await Ad.updateMany({ user_id: creatorId }, { rating: updatedRating });
    res.status(200).json({ updatedRating });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = { loginUser, signupUser, ratingUser };