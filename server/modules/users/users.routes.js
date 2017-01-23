var users = require('./users.controller.js')

module.exports = function (app, middleware) {
  app.post('/users', users.postUser)
  app.post('/users/login', users.loginUser)
  app.delete('/users/logout', middleware.requireAuthentication, users.logoutUser)
}
