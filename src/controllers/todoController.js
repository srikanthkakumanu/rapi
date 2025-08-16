// controllers/todoController.js
const todoService = require('../services/todoService');

exports.createTodo = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { task, description } = req.body;
    const newTodo = await todoService.createTodo(task, description, userId);
    res.status(201).json(newTodo);
  } catch (err) {
    next(err);
  }
};

exports.getTodoById = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;
    const todo = await todoService.getTodoById(id, userId);
    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json(todo);
  } catch (err) {
    next(err);
  }
};

exports.getAllTodos = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const todos = await todoService.getAllTodos(userId);
    res.status(200).json(todos);
  } catch (err) {
    next(err);
  }
};

exports.updateTodo = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;
    const updatedTodo = await todoService.updateTodo(id, userId, req.body);
    if (!updatedTodo) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(200).json(updatedTodo);
  } catch (err) {
    next(err);
  }
};

exports.deleteTodo = async (req, res, next) => {
  try {
    const { id: userId } = req.user;
    const { id } = req.params;
    const success = await todoService.deleteTodo(id, userId);
    if (!success) {
      return res.status(404).json({ message: 'Todo not found' });
    }
    res.status(204).send();
  } catch (err) {
    next(err);
  }
};
