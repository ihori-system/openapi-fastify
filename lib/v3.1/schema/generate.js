const ts = require('typescript')
const {
  parsePathsObject
} = require('./parse')

function generate () {
  parsePathsObject()

  const sourceFile = ts.createSourceFile('source.ts', '', ts.ScriptTarget.Latest)

  return sourceFile
}

module.exports = {
  generate
}
