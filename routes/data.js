const express = require("express");
const router = express.Router();

const { getAllData } = require("../controllers/dataController");


// get all product data for tracking
router.get("/", getAllData);





module.exports = router;
