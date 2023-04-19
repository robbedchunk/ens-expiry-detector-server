const { checkDomain } = require('./../services/domains');

const domainsRouter = require("express").Router();

domainsRouter.get("/", (req, res) => {
  res.send("Hello, Domains!");
});

domainsRouter.get("/:name", (req, res) => {
  const name = req.params.name;
  const response = checkDomain(name);
  res.send(response);
});

module.exports = domainsRouter;
