const express = require("express");
const app = express();

const config = require("./utils/config");
const domainsRouter = require("./controllers/domains");

// Database config
const mongoose = require('mongoose')
mongoose.set('strictQuery', false)

mongoose.connect(config.MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB.')
  })
  .catch((error) => {
    console.log('Error connecting to MongoDB:', error.message)
  })


app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use("/domains", domainsRouter);

module.exports = app;
