const express = require("express");
const {requireAuth} = require('../middleware/requireAuth')
const {
  getProducts,
  createProduct,
  getProduct,
  getCartProducts,
  getFavoriteProducts,
  updateProduct,
  deleteProduct,
  updateProductStock
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

//<--------------Middleware for protecting routes--------------->//
router.use(requireAuth)

// post product
router.post("/", createProduct);

// update product stock
router.patch("/updateProductStock", updateProductStock);

// update product 
router.patch("/:id", updateProduct);

// delete product
router.delete("/:id", deleteProduct);

module.exports = router;
