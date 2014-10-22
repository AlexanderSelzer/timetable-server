var express = require("express")
var bodyParser = require("body-parser")
var passport = require("passport")
var logger = require("./logger")()

var levelup = require("levelup")
var tokendb = levelup("./tokens")

var config = require("./config.json")

var port = config.port || 8131

var app = express()

app.set("secret", config.secret || "seeeecret...not")
app.use(bodyParser.json())
//app.use(passport.initialize())
app.use(function(req, res, next) {
  logger.info(req.method + " " + req.path)
  next()
})

var dbConfig = config.db[app.get("env")]
var knex = require("knex")(dbConfig)
var bookshelf = require("bookshelf")(knex)

app.set("tokendb", tokendb)
app.set("bookshelf", bookshelf)
app.set("models", require("./models")(bookshelf))
app.set("logger", logger)

require("./routes")(app)

app.listen(port)
logger.info("listening on port " + port)
