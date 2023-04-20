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

    // Is domain already in the database?
    const record = await Record.findOne({ domain: domain });

    if (record) {
      console.log(`[${domain}.eth] Domain was found in the database.`);

      const twoDays = 48 * 60 * 60 * 1000;
      const checkCondition =
        record.available || record.expirationDate <= Date.now() + twoDays;

      if (checkCondition) {
        console.log(`[${domain}.eth] Criteria (availability or recent expiry) was matched. Searching availability.`);

        const availability = await checkDomain(domain);
        record.available = availability.available;
        record.owner = availability.owner;
        record.expirationDate = availability.expirationDate;
        record.lastUpdated = Date.now();
        record
          .save()
          .then((savedRecord) => {
            console.log(`[${domain}.eth] Updated record and saved information to the database.`);
          })
          .catch((error) => {
            console.log(error);
          });
      }
    } else {
      console.log(`[${domain}.eth] Domain was not found in the database.`);
      const availability = await checkDomain(domain);

      const newRecord = new Record({
        domain: domain,
        available: availability.available,
        owner: availability.owner,
        expirationDate: availability.expirationDate,
        lastUpdated: Date.now(),
      });

      newRecord
        .save()
        .then((savedRecord) => {
          console.log(`[${domain}.eth] Created record.`);
        })
        .catch((error) => {
          console.log(error);
        });
    }

    console.log("\n");
  }
};

module.exports = { updateDatabaseRecords };
