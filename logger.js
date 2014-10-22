var Winston = require("winston")

module.exports = function() {
  return new Winston.Logger({
    transports: [
      new Winston.transports.Console({
        colorize: true
      }),
      new Winston.transports.File({
        filename: "app.log"
      })
    ]
  })
}
