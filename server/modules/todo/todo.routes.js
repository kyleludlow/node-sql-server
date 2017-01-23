var todo = require('./todo.controller.js')

module.exports = function (app, middleware) {
  // GET
  app.get('/todos', middleware.requireAuthentication, todo.getTodos)
  app.get('/todos/:id', middleware.requireAuthentication, todo.getTodoById)

  // POST
  app.post('/todos', middleware.requireAuthentication, todo.postTodo)

  // DELETE
  app.delete('/todos/:id', middleware.requireAuthentication, todo.deleteTodo)

  // PUT
  app.put('/todos/:id', middleware.requireAuthentication, todo.putTodo)
}
