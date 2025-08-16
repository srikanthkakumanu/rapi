// models/todoModel.js
const { neon } = require('../db/db');

exports.create = async (task, description, userId) => {
  const [newTodo] = await neon.query(
    'INSERT INTO todo_tbl (task, description, created_by) VALUES ($1, $2, $3) RETURNING *',
    [task, description, userId]
  );
  return newTodo;
};

exports.findById = async (id, userId) => {
  const [todo] = await neon.query(
    'SELECT * FROM todo_tbl WHERE id = $1 AND created_by = $2',
    [id, userId]
  );
  return todo;
};

exports.findAllByUserId = async (userId) => {
  const todos = await neon.query(
    'SELECT * FROM todo_tbl WHERE created_by = $1 ORDER BY id ASC',
    [userId]
  );
  return todos;
};

exports.update = async (id, task, description, userId) => {
  const [updatedTodo] = await neon.query(
    'UPDATE todo_tbl SET task = $1, description = $2 WHERE id = $3 AND created_by = $4 RETURNING *',
    [task, description, id, userId]
  );
  return updatedTodo;
};

exports.deleteById = async (id, userId) => {
  const result = await neon.query(
    'DELETE FROM todo_tbl WHERE id = $1 AND created_by = $2 RETURNING id',
    [id, userId]
  );
  return result.length > 0;
};
