const { Pool } = require("pg");

// All of the following properties should be read from environment variables
// We're hardcoding them here for simplicity
module.exports = new Pool({
  host: process.env.DB_HOST, 
  user: process.env.DB_USER,
  database: "manga_inventory",
  password: process.env.DB_PASSWORD,
  port: 5432 // The default port
});
