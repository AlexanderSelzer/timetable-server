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
    res.send("hello")
  })

  /**
  * GET /user
  *
  * Get info about yourself
  *
  * {
  *   status: String
  *   data: null|user
  * }
  */

  app.get("/user", jwtRestrict({secret: app.get("secret")}), function(req, res) {
    User.query("where", "id", "=", req.user.id)
    .fetch()
    .then(function(user) {
      if (user) {
        Timetable.query("where", "user_id", "=", user.id)
        .fetchAll()
        .then(function(timetables) {
          var data = {
            "id": user.get("id"),
            "email": user.get("email"),
            "name": user.get("name"),
            "timetables": timetables
          }
          res.send({status: "success", data: data})
        })
      }
      else {
        res.status(404).send({status: "not found"})
      }
    })
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
      // TODO check friendships
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
    var data = req.body

    if (!data)
      return res.status(400).send({"status": "error", "msg": "no data"})

    var name = data.username
    if (!name)
      return res.status(400).send({"status": "error", "msg": "name required"})

    var email = data.email
    if (!email)
      return res.status(400).send({"status": "error", "msg": "email required"})

    var password = data.password
    if (!password)
      return res.status(400).send({"status": "error", "msg": "password required"})

    var user = new User({
      "name": name,
      "email": email,
      "password": password
    })

    user.save()
    .then(function() {
      res.send({"status": "success"})
    })
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
        res.send({
          token: jwt.sign({
            id: model.id,
            name: model.name
          }, app.get("secret"), {expiresInMinutes: 60 * 48})})
      else
        res.send(401)
    })
  })

  app.get("/timetable/:id", jwtRestrict({secret: app.get("secret")}), function(req, res) {
    res.send({
      id: req.params.name,
      data: {
        weeks: []
      }
    })
  })

  app.put("/timetable", jwtRestrict({secret: app.get("secret")}), function(req, res) {
    var name = req.body.name
    var ttData = req.body.data

    if (!name)
      res.send({"status": "error", "msg": "no name"})

    if (!ttData)
      res.send({"status": "error", "msg": "no data"})

    if (ttData.length > 1e3 * 600 /*600 KB*/) {
      res.send({"status": "error", "msg": "timetable too large"})
    }

    var tt = new Timetable({"name": name, "user_id": req.user.id, "data": ttData})
    tt.save()
    .then(function() {
      res.send({"status": "success"})
    })
  })
}
