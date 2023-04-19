const domainsRouter = require("express").Router();

domainsRouter.get("/", (req, res) => {
  res.send("Hello, Domains!");
});

module.exports = domainsRouter;
