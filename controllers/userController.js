const User = require("../models/userModel");
const Product = require("../models/productModel");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");

const createToken = (_id) => {
  return jwt.sign({ _id }, process.env.SECRET, { expiresIn: "3d" });
};

// login user
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  try {
    // extract properties from db
    const { email, role, productCart, productFavorites, _id } =
      await User.login(username, password);
    const token = createToken(_id);

    res
      .status(200)
      .json({ email, token, role, productCart, productFavorites, username });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// signup user
const signupUser = async (req, res) => {
  const { email, password, role, username, productCart, productFavorites } =
    req.body;

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

    res
      .status(200)
      .json({ email, token, role, productCart, productFavorites, username });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update user
const updateUser = async (req, res) => {
  const id = req.user._id;
  console.log(req.body);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such user" });
  }

  const user = await User.findOneAndUpdate(
    { _id: id},
    { $push: { productCart: req.body } },
    { new: true }
  );

  if (!user) {
    return res.status(400).json({ error: "No such user" });
  }

  res.status(200).json(user);
};

module.exports = { loginUser, signupUser, updateUser };
