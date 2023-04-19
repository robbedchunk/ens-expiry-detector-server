const { checkDomain } = require('./../services/domains');

const domainsRouter = require("express").Router();

domainsRouter.get("/:name", async (req, res) => {
  const name = req.params.name;
  const response = await checkDomain(name);
  res.json(response);
});

module.exports = domainsRouter;
