const ts = require('typescript')
const {
  parsePathsObject
} = require('./parse')

function generate (
  inputPath,
  openapiObject
) {
  const sourceFile = ts.createSourceFile('source.ts', '', ts.ScriptTarget.Latest)

  parsePathsObject()

  return sourceFile
}

module.exports = {
  generate
}
