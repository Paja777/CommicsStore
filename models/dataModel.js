const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const dataSchema = new Schema({
  productId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  price: {
    type: String,
    required: true,
  },
  soldMon: {
    type: Number,
    required: true,
  },
  soldYr: {
    type: String,
    required: true,
  },
  M$: {
    type: Number,
    required: true,
  },
  Y$: {
    type: Number,
    required: true,
  },
});

// static analize data function
dataSchema.statics.analizeData = async function (_id, title, price) {};

module.exports = mongoose.model("Data", dataSchema);
