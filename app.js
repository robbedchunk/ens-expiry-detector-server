const express = require('express');
const cache = require('memory-cache');
const app = express();
const port = 3000;
const { checkAllDomains, checkDomain } = require('./ens-utils');


// Your checkAllDomains and checkDomain functions here

app.get('/domain/:name', async (req, res) => {
  const domain = req.params.name;

  if (domain.length === 3) {
    const cachedData = cache.get(domain);

    if (cachedData) {
      res.json(cachedData);
    } else {
      const data = await checkDomain(domain);
      cache.put(domain, data, 10 * 60 * 1000); // Cache for 10 minutes
      res.json(data);
    }
  } else {
    res.status(400).json({ error: 'Invalid domain length. Domain must be 3 characters long.' });
  }
});

app.get('/all-domains', async (req, res) => {
  const cachedData = cache.get('allDomains');

  if (cachedData) {
    res.json(cachedData);
  } else {
    const data = await checkAllDomains();
    cache.put('allDomains', data, 10 * 60 * 1000); // Cache for 10 minutes
    res.json(data);
  }
});

app.listen(port, () => {
  console.log(`ENS checker app listening at http://localhost:${port}`);
});
