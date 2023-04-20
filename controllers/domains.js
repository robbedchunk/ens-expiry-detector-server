const { exportAllDomains } = require('../services/csv');
const { checkDomain } = require('./../services/domains');

const domainsRouter = require("express").Router();

domainsRouter.get("/csv", async (req, res) => {
  try {
    const csv = await exportAllDomains()
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename=ens-domains.csv');
    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).send('Error exporting data as CSV');
  }
});

domainsRouter.get("/:name", async (req, res) => {
  const name = req.params.name;
  const response = await checkDomain(name);
  res.json(response);
});

module.exports = domainsRouter;
