require('dotenv').config();
const fs = require('fs');
const path = require('path');


const config = {
    host: process.env.PGHOST || process.env.DB_HOST, 
    user: process.env.PGUSER || process.env.DB_USER,
    database: process.env.PGDATABASE || process.env.DB_DATABASE,
    password: process.env.PGPASSWORD || process.env.DB_PASSWORD,
    port: process.env.PGPORT || process.env.DB_PORT , // The default port
  };


if (process.env.NODE_ENV === 'production') {

    // Load SSL/TLS root certificate from the environment variable
    const sslRootCertPath = process.env.PGSSLROOTCERT;

    // Read the root certificate file
    let sslRootCert;
    if (sslRootCertPath) {
    sslRootCert = fs.readFileSync(path.resolve(sslRootCertPath)).toString();
    } else {
    throw new Error('PGSSLROOTCERT environment variable is not set.');
    }

    config.ssl = {
        rejectUnauthorized: true,    // Validate server certificate
        ca: sslRootCert,             // Root certificate
      };
    config.sslMode = process.env.PGSSLMODE || 'require'; // Optional: default to 'require'
};

console.log(config);
module.exports = config;