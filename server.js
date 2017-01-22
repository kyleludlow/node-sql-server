var express = require('express');
var bodyParser = require('body-parser');
var _ = require('underscore');

var app = express();
var PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

app.get('/', function(req, res) {
  res.send('Root.');
});

app.get('/todos', function(req, res) {
});

app.get('/todos/:id', function(req, res) {
});

app.post('/todos', function(req, res) {
});

app.delete('/todos/:id', function(req, res) {
});

app.put('/todos/:id', function(req, res) {
});

app.listen(PORT, function() {
  console.log(`Server started on PORT: ${PORT}!`)
});
