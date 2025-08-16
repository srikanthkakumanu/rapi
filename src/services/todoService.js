// services/todoService.js
const todoModel = require('../models/todoModel');

exports.createTodo = (task, description, userId) => {
  return todoModel.create(task, description, userId);
};

exports.getTodoById = (id, userId) => {
  return todoModel.findById(id, userId);
};

exports.getAllTodos = (userId) => {
  return todoModel.findAllByUserId(userId);
};

exports.updateTodo = async (id, userId, updateData) => {
  const existingTodo = await todoModel.findById(id, userId);
  if (!existingTodo) {
    return null; // Controller will handle 404
  }

  // Use new data if provided, otherwise keep existing data to prevent accidental nulling
  const taskToUpdate =
    updateData.task !== undefined ? updateData.task : existingTodo.task;
  const descriptionToUpdate =
    updateData.description !== undefined
      ? updateData.description
      : existingTodo.description;

  return todoModel.update(id, taskToUpdate, descriptionToUpdate, userId);
};

exports.deleteTodo = (id, userId) => {
  return todoModel.deleteById(id, userId);
};
