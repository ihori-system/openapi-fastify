const fs = require('node:fs')
const ts = require('typescript')
const {
  FIELD_NAME
} = require('../constants')
const {
  parsePathsObject
} = require('./parse')

function generate (inputPath) {
  const inputRaw = fs.readFileSync(inputPath, 'utf8')

  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#openapi-object
  const openapiObject = JSON.parse(inputRaw)

  const sourceFile = ts.createSourceFile('source.ts', '', ts.ScriptTarget.Latest)

  if (typeof openapiObject[FIELD_NAME.PATHS] === 'object') {
    parsePathsObject(
      openapiObject,
      openapiObject[FIELD_NAME.PATHS]
    ).forEach(n => sourceFile.statements.push(n))
  }

  return sourceFile
}

module.exports = {
  generate
}
