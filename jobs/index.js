const { checkDomain } = require("./../services/domains");
const Record = require("./../models/Record");

const getThreeCharacterDomains = () => {
  const chars = "0123456789abcdefghijklmnopqrstuvwxyz";
  const domains = [];

  for (let i = 0; i < chars.length; i++) {
    for (let j = 0; j < chars.length; j++) {
      for (let k = 0; k < chars.length; k++) {
        domains.push(chars[i] + chars[j] + chars[k]);
      }
    }
  }

  return domains;
};

const updateDatabaseRecords = async () => {
  const domains = getThreeCharacterDomains();

  for (let i = 0; i < domains.length; i++) {
    const domain = domains[i];
    const availability = await checkDomain(domain);
    
    const record = new Record({
      domain: domain,
      available: availability.available,
      owner: availability.owner,
      expirationDate: availability.expirationDate,
      lastUpdated: Date.now(),
    });

    record
      .save()
      .then((savedRecord) => {
        // console.log(savedRecord);
      })
      .catch((error) => {
        console.log(error);
      });
  }
};

module.exports = { updateDatabaseRecords }
