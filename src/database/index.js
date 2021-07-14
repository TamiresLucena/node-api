const knex = require('knex');

const db = knex({
  client: 'postgres',
  connection: {
    database: process.env.DB,
    port: process.env.DB_PORT,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
});

module.exports = db;
