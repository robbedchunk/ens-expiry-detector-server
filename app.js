const express = require("express");
const app = express();

const domainsRouter = require("./controllers/domains");

app.get("/", (req, res) => {
  res.send("Hello, world!");
});

app.use("/domains", domainsRouter);

module.exports = app;
