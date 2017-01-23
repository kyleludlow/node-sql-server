var express = require('express')
var bodyParser = require('body-parser')
var _ = require('underscore')

var db = require('./db.js')
var middleware = require('./middleware')(db)

var app = express()
var PORT = process.env.PORT || 3000

app.use(bodyParser.json())

app.get('/', function (req, res) {
  res.send('Root.')
})

// TODO ROUTES
app.get('/todos', middleware.requireAuthentication, function (req, res) {
  var query = req.query
  var where = {}

  if (query.hasOwnProperty('completed') && query.completed === 'true') {
    where.completed = true
  } else if (query.hasOwnProperty('completed') && query.completed === 'false') {
    where.completed = false
  }

  if (query.hasOwnProperty('q') && query.q.length > 0) {
    where.description = {
      $like: `%${query.q}%`
    }
  }

  db.todo.findAll({where: where}).then(function (todos) {
    res.json(todos)
  }, function (err) {
    res.status(500).send()
  })
})

app.get('/todos/:id', middleware.requireAuthentication, function (req, res) {
  var todoId = parseInt(req.params.id, 10)

  db.todo.findById(todoId).then(function (todo) {
    if (todo) {
      res.json(todo.toJSON())
    } else {
      res.status(404).send()
    }
  }, function (err) {
    res.status(500).send()
  })
})

app.post('/todos', function (req, res) {
  var body = _.pick(req.body, 'description', 'completed')

  db.todo.create(body).then(function (todo) {
    req.user.addTodo(todo).then(function () {
      return todo.reload()
    }).then(function (todo) {
      res.json(todo.toJSON())
    })
  }, function (err) {
    res.status(400).json(err)
  })
})

app.delete('/todos/:id', function (req, res) {
  var todoId = parseInt(req.params.id, 10)

  db.todo.destroy({
    where: {
      id: todoId
    }
  }).then(function (rowsDeleted) {
    if (rowsDeleted === 0) {
      res.status(404).json({
        error: 'No todo with id'
      })
    } else {
      res.status(204).send()
    }
  }, function () {
    res.status(500).send()
  })
})

app.put('/todos/:id', middleware.requireAuthentication, function (req, res) {
  var todoId = parseInt(req.params.id, 10)
  var body = _.pick(req.body, 'description', 'completed')
  var attributes = {}

  if (body.hasOwnProperty('completed')) {
    attributes.completed = body.completed
  }

  if (body.hasOwnProperty('description')) {
    attributes.description = body.description
  }

  db.todo.findById(todoId).then(function (todo) {
    if (todo) {
      todo.update(attributes).then(function (todo) {
        res.json(todo.toJSON())
      }, function (err) {
        res.status(400).json(err)
      })
    } else {
      res.status(404).send()
    }
  }, function () {
    res.status(500).send()
  })
})

// USER ROUTES
app.post('/users', function (req, res) {
  var body = _.pick(req.body, 'email', 'password')

  db.user.create(body).then(function (user) {
    res.json(user.toPublicJSON())
  }, function (err) {
    res.status(400).json(err)
  })
})

app.post('/users/login', function (req, res) {
  var body = _.pick(req.body, 'email', 'password')

  db.user.authenticate(body).then(function (user) {
    var token = user.generateToken('authentication')

    if (token) {
      res.header('Auth', token).json(user.toPublicJSON())
    } else {
      res.status(401).send()
    }
  }, function () {
    res.status(401).send()
  })
})

db.sequelize.sync().then(function () {
  app.listen(PORT, function () {
    console.log(`Server started on PORT: ${PORT}!`)
  })
})
