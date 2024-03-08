const Data = require("../models/dataModel");
const mongoose = require("mongoose");

// get all products
const getProducts = async (req, res) => {
  const data = await Data.find({}).sort({ cratedAt: -1 });

  res.status(200).json(data);
};
