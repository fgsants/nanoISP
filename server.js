var mysql = require('mysql')
var express = require('express')
var passport = require('passport')
var bodyParser = require('body-parser')
var Strategy = require('passport-local').Strategy
var rest = require('./rest.js')
var path = require('path')
var md5 = require('md5')
var app = express()

app.use(express.static('web'))
app.use(bodyParser.urlencoded({ extended: true }))

function REST () {
  var self = this
  self.connectMysql()
};

REST.prototype.connectMysql = function () {
  var self = this
  var pool = mysql.createPool({
    connectionLimit: 100,
    host: 'localhost',
    user: 'root',
    password: 'Shelly92',
    database: 'nanoISP',
    debug: false
  })
  pool.getConnection(function (err, connection) {
    if (err) {
      self.stop(err)
    } else {
      self.configureExpress(connection)
    }
  })
}

REST.prototype.configureExpress = function (connection) {
  var self = this
  app.use(bodyParser.urlencoded({ extended: true }))
  app.use(bodyParser.json())
  var router = express.Router()
  app.use('/api', router)
  var rest_router = new rest(router, connection, md5)
  self.startServer()
}

REST.prototype.startServer = function () {
  app.listen(3000, function () {
    console.log('All right ! I am alive at Port 3000.')
  })
}

REST.prototype.stop = function (err) {
  console.log('ISSUE WITH MYSQL n' + err)
  process.exit(1)
}

new REST()
