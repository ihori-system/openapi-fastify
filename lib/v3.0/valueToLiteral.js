const ts = require('typescript')

// https://datatracker.ietf.org/doc/html/draft-wright-json-schema-00#section-4.2
function valueToLiteral (value) {
  if (value === null) {
    return ts.factory.createNull()
  }

  if (value === true) {
    return ts.factory.createTrue()
  }

  if (value === false) {
    return ts.factory.createFalse()
  }

  if (typeof value === 'number') {
    return ts.factory.createNumericLiteral(value)
  }

  if (typeof value === 'string') {
    return ts.factory.createStringLiteral(value)
  }

  throw new Error(`unexpected value type. [${typeof value}]`)
}

module.exports = {
  valueToLiteral
}
