const fs = require('node:fs')
const path = require('node:path')
const yaml = require('js-yaml')
const {
  FIELD_NAME
} = require('./constants')

function resolveReferenceObject (
  inputPath,
  openapiObject,
  reference,
  paths,
  currentObject
) {
  if (paths[0] in currentObject === false) {
    throw new Error(`$ref could not be resolved. given value: ${reference}`)
  }

  if (paths.length > 1) {
    return resolveReferenceObject(
      inputPath,
      openapiObject,
      reference,
      paths,
      currentObject[paths.shift()]
    )
  }

  return currentObject[paths.shift()]
}

function resolveRelativeSchemaDocument (
  inputPath,
  reference
) {
  const ext = path.extname(reference)
  if (ext === '.json') {
    return JSON.parse(
      fs.readFileSync(path.resolve(path.dirname(inputPath), reference), 'utf8')
    )
  } else if (ext === '.yaml' || ext === '.yml') {
    return yaml.load(
      fs.readFileSync(path.resolve(path.dirname(inputPath), reference), 'utf8')
    )
  }

  throw new Error(`Unknown $ref file type. valid extensions are '.json' or '.yaml', 'yml'. given value: ${reference}`)
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#reference-object
function parseReferenceObject (
  inputPath,
  openapiObject,
  reference
) {
  if (typeof reference !== 'string') {
    // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#reference-object
    // > REQUIRED. The reference identifier. This MUST be in the form of a URI.
    throw new Error(`The reference identifier is must be in the form of a URI. given value: ${reference}`)
  }

  if (reference.startsWith('#')) {
    const resolvedObject = resolveReferenceObject(
      inputPath,
      openapiObject,
      reference,
      reference.split('/').slice(1),
      openapiObject
    )

    if (FIELD_NAME.REF in resolvedObject) {
      return parseReferenceObject(
        inputPath,
        openapiObject,
        resolvedObject[FIELD_NAME.REF]
      )
    }

    return resolvedObject
  }

  const resolvedObject = resolveRelativeSchemaDocument(
    inputPath,
    reference
  )

  return resolvedObject
}

module.exports = {
  parseReferenceObject,
  resolveRelativeSchemaDocument
}
