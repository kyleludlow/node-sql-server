var express = require('express')
var bodyParser = require('body-parser')

var db = require('./db.js')
var middleware = require('./middleware')(db)


var app = express()
var PORT = process.env.PORT || 3000

app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Root.')
})

// ROUTES
var todoRoutes = require('./modules/todo/todo.routes')(app, middleware)
var userRoutes = require('./modules/users/users.routes')(app, middleware)

db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log(`Server started on PORT: ${PORT}!`)
  })
})
