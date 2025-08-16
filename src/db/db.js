require('dotenv').config();
const { neon } = require('@neondatabase/serverless');

const DB_URL = process.env.NEON_DB_URL;

if (!DB_URL) {
  throw new Error('NEON_DB_URL is not defined in the environment variables.');
}

const sql = neon(DB_URL);

module.exports = {
  // The exported 'neon' is now a function to execute SQL queries.
  neon: sql,
};
