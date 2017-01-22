var express = require('express')
var bodyParser = require('body-parser')
var _ = require('underscore')

var app = express()
var PORT = process.env.PORT || 3000

var todos = []
var todoNextId = 1

app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Root.')
})

app.get('/todos', function (req, res) {
  var queryParams = req.query
  var filteredTodos = todos

  if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'true') {
    filteredTodos = _.where(filteredTodos, {completed: true})
  } else if (queryParams.hasOwnProperty('completed') && queryParams.completed === 'false') {
    filteredTodos = _.where(filteredTodos, {completed: false})
  }

  if (queryParams.hasOwnProperty('q') && queryParams.q.length > 0) {
    filteredTodos = _.filter(filteredTodos, function (todo) {
      return todo.description.toLowerCase().indexOf(queryParams.q.toLowerCase()) > -1
    })
  }

  res.json(filteredTodos)
})

app.get('/todos/:id', function (req, res) {
})

app.post('/todos', function (req, res) {
})

app.delete('/todos/:id', function (req, res) {
})

app.put('/todos/:id', function (req, res) {
})

app.listen(PORT, function () {
  console.log(`Server started on PORT: ${PORT}!`)
})
