const ts = require('typescript')
const {
  FIELD_NAME
} = require('../constants')
const {
  parsePathsObject
} = require('./parse')

function generate (
  inputPath,
  openapiObject
) {
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#openapi-object
  // > REQUIRED. Provides metadata about the API. The metadata MAY be used by tooling as required.
  if (FIELD_NAME.INFO in openapiObject === false) {
    throw new Error('OpenAPI Object requires Info Object.')
  }

  const sourceFile = ts.createSourceFile('source.ts', '', ts.ScriptTarget.Latest)

  parsePathsObject()

  return sourceFile
}

module.exports = {
  generate
}
