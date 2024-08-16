const config=require('./config');
const { Pool } = require('pg');



module.exports = new Pool(config);
