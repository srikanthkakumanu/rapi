// models/userModel.js
const { neon } = require('../db/db');

exports.create = async (email, passwordHash) => {
  const [newUser] = await neon.query(
    'INSERT INTO users_tbl (email, password_hash) VALUES ($1, $2) RETURNING id, email, created',
    [email, passwordHash]
  );
  return newUser;
};

exports.findByEmail = async (email) => {
  const [user] = await neon.query('SELECT * FROM users_tbl WHERE email = $1', [
    email,
  ]);
  return user;
};
