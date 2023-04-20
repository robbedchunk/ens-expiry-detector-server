const { updateDatabaseRecords } = require('../jobs');
const { exportAllDomains } = require('../services/csv');
const { set, get } = require('../services/parameters');
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

domainsRouter.get("/run-job", (req,res) => {
  if (!req.query.api_key || req.query.api_key !== "BLOCKCHAININSPERNOTOPO") return res.status(403).send('Unauthorized')
  if(!get('canRun')) res.status(400).send('Cannot run job if it is disabled. Please enable it on /enable-job before running it.')
  updateDatabaseRecords()
  res.status(200).send("Started executing job")
})

domainsRouter.get("/disable-job", (req,res) => {
  if (!req.query.api_key || req.query.api_key !== "BLOCKCHAININSPERNOTOPO") return res.status(403).send('Unauthorized')
  set('canRun', false)
  res.status(200).send("Disabled job")
})

domainsRouter.get("/enable-job", (req,res) => {
  if (!req.query.api_key || req.query.api_key !== "BLOCKCHAININSPERNOTOPO") return res.status(403).send('Unauthorized')
  set('canRun', true)
  res.status(200).send("Enabled job")
})

domainsRouter.get("/get-job-status", (req,res) => {
  if (!req.query.api_key || req.query.api_key !== "BLOCKCHAININSPERNOTOPO") return res.status(403).send('Unauthorized')
  res.status(200).json({canRun: get('canRun')})
})

domainsRouter.get("/:name", async (req, res) => {
  const name = req.params.name;
  const response = await checkDomain(name);
  res.json(response);
});

const exports_ = { domainsRouter }

module.exports = exports_;
