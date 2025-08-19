// routes/todoRoutes.js
const express = require('express');
const router = express.Router();
const todoController = require('../controllers/todoController');
const authMiddleware = require('../middleware/authMiddleware');
const {
  validate,
  createTodoSchema,
  updateTodoSchema,
} = require('../validators/authValidator');

/**
 * @swagger
 * /tapi/todos:
 * post:
 * summary: Create a new todo item
 * tags: [Todos]
 * security:
 * - bearerAuth: []
 * requestBody:
 *   required: true
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         required:
 *           - task
 *         properties:
 *           task:
 *             type: string
 *             description: The name of the task.
 *           description:
 *             type: string
 *             description: A detailed description of the task.
 * responses:
 * 201:
 * description: The created todo item.
 * 401:
 * description: Unauthorized.
 */
router.post(
  '/',
  authMiddleware,
  validate(createTodoSchema),
  todoController.createTodo
);

/**
 * @swagger
 * /tapi/todos/{id}:
 * get:
 * summary: Get a single todo item
 * tags: [Todos]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: string
 * required: true
 * description: The todo ID
 * responses:
 * 200:
 * description: The todo item.
 * 404:
 * description: Todo not found.
 */
router.get('/:id', authMiddleware, todoController.getTodoById);

/**
 * @swagger
 * /tapi/todos:
 * get:
 * summary: Get all todo items for the authenticated user
 * tags: [Todos]
 * security:
 * - bearerAuth: []
 * responses:
 * 200:
 * description: A list of the user's todo items.
 * 401:
 * description: Unauthorized.
 */
router.get('/', authMiddleware, todoController.getAllTodos);

/**
 * @swagger
 * /tapi/todos/{id}:
 * put:
 * summary: Update a todo item
 * tags: [Todos]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: string
 * required: true
 * description: The todo ID
 * requestBody:
 *   required: true
 *   content:
 *     application/json:
 *       schema:
 *         type: object
 *         properties:
 *           task:
 *             type: string
 *             description: The updated name of the task.
 *           description:
 *             type: string
 *             description: The updated detailed description of the task.
 * responses:
 * 200:
 * description: The updated todo item.
 * 404:
 * description: Todo not found.
 */
router.put(
  '/:id',
  authMiddleware,
  validate(updateTodoSchema),
  todoController.updateTodo
);

/**
 * @swagger
 * /tapi/todos/{id}:
 * delete:
 * summary: Delete a todo item
 * tags: [Todos]
 * security:
 * - bearerAuth: []
 * parameters:
 * - in: path
 * name: id
 * schema:
 * type: string
 * required: true
 * description: The todo ID
 * responses:
 * 204:
 * description: Todo item deleted.
 * 404:
 * description: Todo not found.
 */
router.delete('/:id', authMiddleware, todoController.deleteTodo);

module.exports = router;
