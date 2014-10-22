var passport = require("passport")
var jwt = require("jsonwebtoken")
var jwtRestrict = require("express-jwt")

module.exports = function(app) {
  var logger = app.get("logger")
  var models = app.get("models")
  var tokendb = app.get("tokendb")

  var User = models.User
  var Timetable = models.Timetable

  app.get("/", function(req, res) {
    res.send(req.user)
  })

  app.get("/user", jwtRestrict({secret: app.get("secret")}), function(req, res) {
    res.send(req.user)
  })

  /**
  * GET /user/:name
  *
  * {
  *   status: String
  *   data: null|user
  * }
  */

  app.get("/user/:name", function(req, res) {
    User
      .query("where", "name", "=", req.params.name)
      .fetch()
      .then(function(model) {
        if (model) {
          res.send({status: "success", data: model})
        }
        else {
          res.status(404).send({status: "not found"})
        }
      })
  })

  /**
  * PUT /user
  *
  * Responds to clients (app/web page) trying to sign up.
  * In most use cases, the specific error messages should not happen,
  * as the client takes care of authenticating.
  *
  * {
  *   status: String,
  *   username: Username validity message
  *   password: Password validity message
  *   email: Email validity message
  * }
  */

  app.put("/user", function(req, res) {
    var data = res.body

    var name = data.name
    var email = data.email

    var user = new User({
      "name": name,
      "email": email
    })

    user.save()
  })

  app.post("/login", function(req, res) {
    var username = req.body.username
    var password = req.body.password

    logger.info("user", username, "attempts to log in")

    models.User
    .query(function(q) {
      q.where("name", "=", username)
      .andWhere("password", "=", password)
    })
    .fetch()
    .then(function(model) {
      if (model)
        res.send({token: jwt.sign({id: model.id, name: model.name}, app.get("secret"), {expiresInMinutes: 60 * 48})})
      else
        res.send(401)
    })
  })

  app.post("/logout", function(req, res) {

  })

  app.post("/register", function(req, res) {

  })

  app.get("/timetable/:id", jwtRestrict({secret: app.get("secret")}), function(req, res) {
    res.send({
      id: req.params.name,
      data: {
        weeks: []
      }
    })
  })

  app.put("/timetable", function(req, res) {

  })
}
