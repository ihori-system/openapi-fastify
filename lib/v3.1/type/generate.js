const ts = require('typescript')
const {
  FIELD_NAME
} = require('../constants')
const {
  parseComponentsObject,
  parsePathsObject
} = require('./parse')

function generate (
  inputPath,
  openapiObject
) {
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#openapi-object
  // > REQUIRED. Provides metadata about the API. The metadata MAY be used by tooling as required.
  if (typeof openapiObject[FIELD_NAME.INFO] !== 'object') {
    throw new Error('OpenAPI Object requires Info Object.')
  }

  const sourceFile = ts.createSourceFile('source.ts', '', ts.ScriptTarget.Latest)

  if (typeof openapiObject[FIELD_NAME.PATHS] === 'object') {
    parsePathsObject(
      inputPath,
      openapiObject,
      openapiObject[FIELD_NAME.PATHS]
    ).forEach(n => sourceFile.statements.push(n))
  }

  if (typeof openapiObject[FIELD_NAME.COMPONENTS] === 'object') {
    parseComponentsObject(
      inputPath,
      openapiObject,
      openapiObject[FIELD_NAME.COMPONENTS]
    ).forEach(n => sourceFile.statements.push(n))
  }

  return sourceFile
}

module.exports = {
  generate
}
