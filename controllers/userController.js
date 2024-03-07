const User = require("../models/userModel");
const Product = require("../models/productModel");
// const jwt = require("jsonwebtoken");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login user
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // extract properties from db
    const { role, username, productCart, productFavorites, _id } = await User.login(email, password);
    const token = createToken(_id);

    res.status(200).json({ email, token, role, productCart, productFavorites, username });
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
  username,
  productCart,
  productFavorites
  } = req.body;

  try {
    const user = await User.signup(
        email,
        password,
        role,
        username,
        productCart,
        productFavorites
    );
    const token = createToken(user._id);

    res.status(200).json({ email, token, role, productCart, productFavorites, username });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


module.exports = { loginUser, signupUser };