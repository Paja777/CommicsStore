const express = require("express");
const router = express.Router();
const {requireAuth, restrict} = require("../middleware/requireAuth")

const { getAllData } = require("../controllers/dataController");

router.use(requireAuth);
// router.use(restrict("admin"));

// get all product data for tracking
router.get("/", getAllData);


// update product data


// delete product data





module.exports = router;
