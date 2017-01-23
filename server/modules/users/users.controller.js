var db = require('../../db.js')
var _ = require('lodash')

exports.postUser = function (req, res) {
  var body = _.pick(req.body, 'email', 'password')

  db.user.create(body).then(function (user) {
    res.json(user.toPublicJSON())
  }, function (err) {
    res.status(400).json(err)
  })
}

exports.loginUser = function (req, res) {
  var body = _.pick(req.body, 'email', 'password')
  var userInstance

  db.user.authenticate(body).then(function (user) {
    var token = user.generateToken('authentication')
    userInstance = user

    return db.token.create({
      token: token
    })
  }).then(function (tokenInstance) {
    res.header('Auth', tokenInstance.get('token')).json()
  }).catch(function () {
    res.status(401).send()
  })
}

exports.logoutUser = function (req, res) {
  req.token.destroy().then(function () {
    res.status(204).send()
  }).catch(function () {
    res.status(500).send()
  })
}
