require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  
  next();
});

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true 
}));

app.use("/product", productRoutes);
app.use("/user", userRoutes);

mongoose 
  .connect(process.env.MONGO_URI, {
    dbName: 'CommicsStore',
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    //listen for requests
    app.listen(process.env.PORT, () => {
      console.log("Connected to db, and listening on port 6000");
    });
  })
  .catch((err) => {
    console.log(err);
  });