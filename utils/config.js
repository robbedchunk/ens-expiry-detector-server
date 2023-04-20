require("dotenv").config();

const PORT = process.env.PORT;
const MONGODB_URI = process.env.MONGODB_URI
const INFURA_API_KEY = process.env.INFURA_API_KEY

module.exports = { PORT, MONGODB_URI, INFURA_API_KEY };
