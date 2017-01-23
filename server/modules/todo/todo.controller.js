var db = require('../../db.js')
var _ = require('lodash')


exports.getTodos = function (req, res) {
  var query = req.query
  var where = {
    userId: req.user.get('id')
  }

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
}



exports.getTodoById = function (req, res) {
  var todoId = parseInt(req.params.id, 10)

  db.todo.findOne({
    where: {
      userId: req.user.get('id'),
      id: todoId
    }
  }).then(function (todo) {
    if (todo) {
      res.json(todo.toJSON())
    } else {
      res.status(404).send()
    }
  }, function (err) {
    res.status(500).send()
  })
}

exports.postTodo = function (req, res) {
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
}

exports.deleteTodo = function (req, res) {
  var todoId = parseInt(req.params.id, 10)

  db.todo.destroy({
    where: {
      userId: req.user.get('id'),
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
}


exports.putTodo = function (req, res) {
  var todoId = parseInt(req.params.id, 10)
  var body = _.pick(req.body, 'description', 'completed')
  var attributes = {}

  if (body.hasOwnProperty('completed')) {
    attributes.completed = body.completed
  }

  if (body.hasOwnProperty('description')) {
    attributes.description = body.description
  }

  db.todo.findOne({
    where: {
      userId: req.user.get('id'),
      id: todoId
    }
  }).then(function (todo) {
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
}
