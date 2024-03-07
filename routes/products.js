const express = require("express");
const {
  getProducts,
  createProduct,
  getProduct,
  getCartProducts,
  getFavoriteProducts,
  updateProduct,
  deleteProduct
} = require("../controllers/productContoller");

const router = express.Router();

// get all products
router.get("/", getProducts);

// // get single product
router.get("/:id", getProduct);

// // get cart products
router.get("/cart/products", getCartProducts);

// get favourite products
router.get("/favorite/products", getFavoriteProducts);

// post product
router.post("/", createProduct);

// update product
router.patch("/:id", updateProduct);

// delete product
router.delete("/:id", deleteProduct);

module.exports = router;
