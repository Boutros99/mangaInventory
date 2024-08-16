// db.js
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Load SSL/TLS root certificate from the environment variable
const sslRootCertPath = process.env.PGSSLROOTCERT;

// Read the root certificate file
let sslRootCert;
if (sslRootCertPath) {
  sslRootCert = fs.readFileSync(path.resolve(sslRootCertPath)).toString();
} else {
  throw new Error('PGSSLROOTCERT environment variable is not set.');
}


module.exports = new Pool({
  host: process.env.PGDHOST || process.env.DB_HOST, 
  user: process.env.PGUSER || process.env.DB_USER,
  database: process.env.PGDATABASE || "manga_inventory",
  password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
  port: process.env.PGPORT ||5432, // The default port
  ssl: {
    rejectUnauthorized: true,    // Validate server certificate
    ca: sslRootCert,             // Root certificate
  },
  sslMode: process.env.PGSSLMODE || 'require', // Optional: default to 'require'
});
