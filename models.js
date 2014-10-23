module.exports = function(bookshelf) {

  var User = bookshelf.Model.extend({
    tableName: "users",
    initialize: function() {

    },
    name: "",
    email: "",
    password: ""
  })

  var Timetable = bookshelf.Model.extend({
    tableName: "timetables"
  })

  return {
    "Timetable": Timetable,
    "User": User
  }
}
