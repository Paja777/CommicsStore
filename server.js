require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const path = require('path');
const productRoutes = require("./routes/products");
const userRoutes = require("./routes/users");
const dataRoutes = require('./routes/data')

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  
  next();
});

app.use(cors({
    origin: 'https://comicbook-store-gxha.onrender.com',
    credentials: true 
}));

// Serve static files from the build directory
app.use(express.static(path.join(__dirname, 'dist')));

app.use("/product", productRoutes);
app.use("/user", userRoutes);
app.use("/data", dataRoutes);

// Serve the index.html file for all other routes
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

mongoose 
  .connect(process.env.MONGO_URI, {
    dbName: 'CommicsStore',
  })
  .then(() => {
    //listen for requests
    app.listen(process.env.PORT, () => {
      console.log("Connected to db, and listening on port 3100");
    });
  })
  .catch((err) => {
    console.log(err);
  });