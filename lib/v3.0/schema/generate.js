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

  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#openapi-object
  // > REQUIRED. The available paths and operations for the API.
  if (FIELD_NAME.PATHS in openapiObject === false) {
    throw new Error('OpenAPI Object requires Paths Object.')
  }

  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#info-object
  // > REQUIRED. The title of the API.
  if (FIELD_NAME.TITLE in openapiObject[FIELD_NAME.INFO] === false) {
    throw new Error('Info Object requires title field.')
  }

  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#info-object
  // > REQUIRED. The version of the OpenAPI document (which is distinct from the OpenAPI Specification version or the API implementation version).
  if (FIELD_NAME.VERSION in openapiObject[FIELD_NAME.INFO] === false) {
    throw new Error('Info Object requires version field.')
  }

  const sourceFile = ts.createSourceFile('source.ts', '', ts.ScriptTarget.Latest)

  parsePathsObject(
    inputPath,
    openapiObject,
    openapiObject[FIELD_NAME.PATHS]
  ).forEach(n => sourceFile.statements.push(n))

  return sourceFile
}

module.exports = {
  generate
}
