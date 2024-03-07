require('dotenv').config();

const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const productRouter = require("./routes/products")

const app = express();

app.use(express.json());
app.use((req, res, next) => {
  
  next();
});

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true 
}));

app.use("/product", productRouter);
// app.use("/user", userRoutes);

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