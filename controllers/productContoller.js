const Product = require("../models/productModel");
const User = require("../models/userModel");
const Data = require("../models/dataModel");
const mongoose = require("mongoose");

// get all products
const getProducts = async (req, res) => {
  // current page
  const page = req.query.p || 0;

  const productsPerPage = req.query.limit;

  const searchParam = req.query.searchTerm || "";

  const categoryParam = req.query.category || "";
  console.log(categoryParam);
  let products = [];

  try {
    let query = {};
    if (searchParam || categoryParam) {
      const searchRegex = new RegExp(searchParam, "i");
      const categoryRegex = new RegExp(categoryParam, "i");
      query = {
        title: { $regex: searchRegex },
        category: { $regex: categoryRegex },
      };
    }
    const totalProducts = await Product.countDocuments(query);

    let totalPages = 0;
    if (totalProducts > productsPerPage) {
      totalPages = Math.round(totalProducts / productsPerPage);
    }
    products = await Product.find(query)
      .skip(page * productsPerPage)
      .limit(productsPerPage);
    const results = { products, totalProducts, totalPages };
    res.status(200).json(results);
  } catch (error) {
    console.error(error); // Log the error for debugging
    res.status(500).json({ error: "Could not fetch the documents" });
  }
};

// get single product
const getProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: "No such product" });
  }
  const product = await Product.findById(id);

  if (!product) {
    return res.status(400).json({ erorr: "No such product" });
  }
  res.status(200).json(product);
};

// get cart products
const getCartProducts = async (req, res) => {
  const products = await Product.find({}).sort({ cratedAt: -1 });

  res.status(200).json(products);
};

// get favourite products
const getFavoriteProducts = async (req, res) => {
  const products = await Product.find({}).sort({ cratedAt: -1 });

  res.status(200).json(products);
};

// create product
const createProduct = async (req, res) => {
  const { title, image, category, price, stock, description, rating } =
    req.body;

  try {
    const product = await Product.create({
      title,
      image,
      category,
      price,
      stock,
      description,
      rating,
      stock,
      soldMon: 0,
      soldYr: 0,
      M$: 0,
      Y$: 0,
    });

    // create product data for data tracking (admin)
    const dataResponse = await Data.create({
      productId: product._id,
      title,
      price,
      stock,
      soldMon: 0,
      soldYr: 0,
      M$: 0,
      Y$: 0,
    });

    res.status(200).json(dataResponse);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// update product
const updateProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such product" });
  }

  const product = await Product.findOneAndUpdate(
    { _id: id },
    {
      ...req.body,
    }
  );
  await Data.findOneAndUpdate(
    { productId: id },
    {
      ...req.body,
    }
  );

  if (!product) {
    return res.status(400).json({ error: "No such product" });
  }

  res.status(200).json(product);
};

// delete product
const deleteProduct = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: "No such ad" });
  }

  const product = await Product.findOneAndDelete({ _id: id });
  const productData = await Data.findOneAndDelete({ productId: id });

  if (!product) {
    return res.status(400).json({ error: "No such product" });
  }

  res.status(200).json(product);
};

// update product stock after selling product
const updateProductStock = async (req, res) => {
  const { products } = req.body;
  const userId = req.user._id;
  let product;
  try {
    const updatedProducts = await Promise.all(
      products.map(async (p) => {
        if (!mongoose.Types.ObjectId.isValid(p._id)) {
          return res.status(400).json({ error: "No such product" });
        }
        product = await Product.findById({ _id: p._id });
        console.log(product.stock);

        if (product.stock >= p.amount) {
          product.stock -= p.amount;
          product = await Product.findOneAndUpdate(
            { _id: p._id },
            {
              ...product,
            },
            { new: true }
          );
          await User.findOneAndUpdate(
            { _id: userId },
            { $set: { productCart: [] } }
          );
          await Data.findOneAndUpdate(
            { productId: p._id },
            {
              $set: { stock: product.stock },
            },
            { new: true }
          );
          console.log(product.stock);
        } else {
          throw new Error(
            `There is not enough stock for ${p.amount} ${product.title}. Only ${product.stock} available.`
          );
        }
      })
    );

    res.status(200).json(product);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getProducts,
  createProduct,
  getProduct,
  getCartProducts,
  getFavoriteProducts,
  updateProduct,
  deleteProduct,
  updateProductStock,
};
