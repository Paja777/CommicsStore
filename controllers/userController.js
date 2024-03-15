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

// add product to user's cart
const addToCart = async (req, res) => {
  const id = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such user" });
  }
  try {
    let user = await User.findById({ _id: id });

    if (!user) {
      return res.status(400).json({ error: "No such user" });
    }

    const existingProductIndex = user.productCart.findIndex(
      (item) => item.productId === req.body.productId
    );

    if (existingProductIndex !== -1) {
      // If the product exists, update the amount
      user.productCart[existingProductIndex].amount += req.body.amount;
    } else {
      // If the product doesn't exist, push it to the productCart array
      user.productCart.push({
        productId: req.body.productId,
        amount: req.body.amount,
        price: req.body.price,
        title: req.body.title,
      });
    }

    // Save the updated user
    const updatedUser = await User.findOneAndUpdate(
      { _id: id },
      { ...user },
      { new: true }
    );
    console.log(updatedUser);

    res.status(200).json(updatedUser);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server Error" });
  }
};

// remove product from user's cart or
const removeFrom = async (req, res) => {
  const { place } = req.params;
  const id = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such user" });
  }
  let user = await User.findById({ _id: id });

  if (place === "cart" && req.body.amount) {
    if (!user) {
      return res.status(400).json({ error: "No such user" });
    }

    const existingProductIndex = user.productCart.findIndex(
      (item) => item.productId === req.body.productId
    );

    if (
      existingProductIndex !== -1 &&
      user.productCart[existingProductIndex].amount > 1
    ) {
      console.log("postoji product i amount je veci od 1:",user.productCart[existingProductIndex].amount )
      // If the product exists, update the amount
      user.productCart[existingProductIndex].amount -= req.body.amount;
      await User.findOneAndUpdate({ _id: id }, { ...user }, { new: true });
    } else {

      console.log("postoji product i amount je 1:",user.productCart[existingProductIndex].amount )
      
      user = await User.findOneAndUpdate(
        { _id: id },
        { $pull: { productCart: { productId: req.body.productId } } },
        { new: true }
      );
    }
  } else if (place === cart) {
    user = await User.findOneAndUpdate(
      { _id: id },
      { $pull: { productCart: { productId: req.body.productId } } },
      { new: true }
    );
  } else {
    user = await User.findOneAndUpdate(
      { _id: id },
      { $pull: { productFavorites: { productId: req.body.productId } } },
      { new: true }
    );
  }

  if (!user) {
    return res.status(400).json({ error: "No such user" });
  }

  res.status(200).json(user);
};

const addToFavorites = async (req, res) => {
  const id = req.user._id;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such user" });
  }

  const user = await User.findOneAndUpdate(
    { _id: id },
    { $push: { productFavorites: { productId: req.body.productId } } },
    { new: true }
  );

  if (!user) {
    return res.status(400).json({ error: "No such user" });
  }

  res.status(200).json(user);
};

module.exports = {
  loginUser,
  signupUser,
  addToCart,
  removeFrom,
  addToFavorites,
};
