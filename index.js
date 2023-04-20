const app = require("./app");
const config = require('./utils/config')
const cron = require('node-cron');

const { updateDatabaseRecords } = require("./jobs/index");

cron.schedule('0 18 * * *', () => {
  updateDatabaseRecords();
});

app.listen(config.PORT, () => {
  console.log(`Server running on port ${config.PORT}`);
});
