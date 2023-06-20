const fs = require('node:fs')
const path = require('node:path')
const yaml = require('js-yaml')
const {
  generateSchemaV30,
  generateTypeV30,
  generateSchemaV31,
  generateTypeV31
} = require('./lib')

function readAndGenerateSchema (inputPath) {
  const inputRaw = fs.readFileSync(inputPath, 'utf8')

  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#openapi-object
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#openapi-object
  let openapiObject = {}
  const ext = path.extname(inputPath)
  if (ext === '.json') {
    openapiObject = JSON.parse(inputRaw)
  } else if (ext === '.yaml') {
    openapiObject = yaml.load(inputRaw)
  } else {
    throw new Error(`'unknown input file type. valid extensions are '.json' or '.yaml'. given input path: ${inputPath}`)
  }

  if (openapiObject.openapi.startsWith('3.1')) {
    return generateSchemaV31(inputPath, openapiObject)
  } else if (openapiObject.openapi.startsWith('3.0')) {
    return generateSchemaV30(inputPath, openapiObject)
  } else {
    throw new Error('unknown OpenAPI version')
  }
}

function readAndGenerateType (inputPath) {
  const inputRaw = fs.readFileSync(inputPath, 'utf8')

  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#openapi-object
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#openapi-object
  let openapiObject = {}
  const ext = path.extname(inputPath)
  if (ext === '.json') {
    openapiObject = JSON.parse(inputRaw)
  } else if (inputPath.endsWith('.yaml')) {
    openapiObject = yaml.load(inputRaw)
  } else {
    throw new Error(`'unknown input file type. valid extensions are '.json' or '.yaml'. given input path: ${inputPath}`)
  }

  if (openapiObject.openapi.startsWith('3.1')) {
    return generateTypeV31(inputPath, openapiObject)
  } else if (openapiObject.openapi.startsWith('3.0')) {
    return generateTypeV30(inputPath, openapiObject)
  } else {
    throw new Error('unknown OpenAPI version')
  }
}

module.exports = {
  readAndGenerateSchema,
  readAndGenerateType
}
