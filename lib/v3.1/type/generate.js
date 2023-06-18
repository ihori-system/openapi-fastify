const ts = require('typescript')
const {
  parseComponentsObject,
  parsePathsObject
} = require('./parse')

function generate () {
  parsePathsObject()

  parseComponentsObject()

  const sourceFile = ts.createSourceFile('source.ts', '', ts.ScriptTarget.Latest)

  return sourceFile
}

module.exports = {
  generate
}
