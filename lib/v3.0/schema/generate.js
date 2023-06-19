const fs = require('node:fs')
const path = require('node:path')
const yaml = require('js-yaml')
const ts = require('typescript')
const {
  FIELD_NAME
} = require('../constants')
const {
  parsePathsObject
} = require('./parse')

function generate (inputPath) {
  const inputRaw = fs.readFileSync(inputPath, 'utf8')

  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#openapi-object
  let openapiObject = {}
  const ext = path.extname(inputPath)
  if (ext === '.json') {
    openapiObject = JSON.parse(inputRaw)
  } else if (inputPath.endsWith('.yaml')) {
    openapiObject = yaml.load(inputRaw)
  } else {
    throw Error(`'unknown input file type. valid extensions are '.json' or '.yaml'. given input path: ${inputPath}`)
  }

  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#openapi-object
  // > REQUIRED. Provides metadata about the API. The metadata MAY be used by tooling as required.
  if (typeof openapiObject[FIELD_NAME.INFO] !== 'object') {
    throw new Error('OpenAPI Object requires Info Object.')
  }

  const sourceFile = ts.createSourceFile('source.ts', '', ts.ScriptTarget.Latest)

  parsePathsObject()

  return sourceFile
}

module.exports = {
  generate
}
