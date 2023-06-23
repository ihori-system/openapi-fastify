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
    throw new Error('Info Object required title field.')
  }

  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#info-object
  // > REQUIRED. The version of the OpenAPI document (which is distinct from the OpenAPI Specification version or the API implementation version).
  if (FIELD_NAME.VERSION in openapiObject[FIELD_NAME.INFO] === false) {
    throw new Error('Info Object requires version field.')
  }

  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#license-object
  // > REQUIRED. The license name used for the API.
  if (
    FIELD_NAME.LICENSE in openapiObject[FIELD_NAME.INFO] &&
    FIELD_NAME.NAME in openapiObject[FIELD_NAME.INFO][FIELD_NAME.LICENSE] === false
  ) {
    throw new Error('License Object requires name field.')
  }

  if (Array.isArray(openapiObject[FIELD_NAME.SERVERS])) {
    openapiObject[FIELD_NAME.SERVERS].forEach(s => {
      // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#server-object
      // > REQUIRED. A URL to the target host. This URL supports Server Variables and MAY be relative, to indicate that the host location is relative to the location where the OpenAPI document is being served. Variable substitutions will be made when a variable is named in {brackets}.
      if (FIELD_NAME.URL in s === false) {
        throw new Error('Server Object requires url field.')
      }

      if (FIELD_NAME.VARIABLES in s) {
        Object.values(s[FIELD_NAME.VARIABLES]).forEach(v => {
          // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#server-variable-object
          // > REQUIRED. The default value to use for substitution, which SHALL be sent if an alternate value is not supplied. Note this behavior is different than the Schema Object's treatment of default values, because in those cases parameter values are optional. If the enum is defined, the value SHOULD exist in the enum's values.
          if (FIELD_NAME.DEFAULT in v === false) {
            throw new Error('Server Variable Object requires default field.')
          }
        })
      }
    })
  }

  const sourceFile = ts.createSourceFile('source.ts', '', ts.ScriptTarget.Latest)

  parsePathsObject(
    inputPath,
    openapiObject,
    openapiObject[FIELD_NAME.PATHS]
  ).forEach(n => sourceFile.statements.push(n))

  if (FIELD_NAME.COMPONENTS in openapiObject) {
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
