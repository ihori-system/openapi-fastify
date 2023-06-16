const {
  parseComponentsObject,
  parsePathsObject
} = require('./parse')

function generate () {
  parsePathsObject()

  parseComponentsObject()
}

module.exports = {
  generate
}
