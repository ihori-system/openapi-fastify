const ts = require('typescript')
const {
  FIELD_NAME,
  HTTP_REQUEST_METHODS,
  MEDIA_TYPE,
  OAS_DEFINED_TYPE,
  PRIMITIVE_TYPE
} = require('../constants')

function toTypeNode (
  inputPath,
  openapiObject,
  obj
) {
  if (obj[FIELD_NAME.TYPE] === PRIMITIVE_TYPE.OBJECT) {
    return ts.factory.createTypeLiteralNode(
      parseSchemaObject(
        inputPath,
        openapiObject,
        obj
      )
    )
  }

  if (obj[FIELD_NAME.TYPE] === PRIMITIVE_TYPE.STRING) {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
  }

  if (obj[FIELD_NAME.TYPE] === OAS_DEFINED_TYPE.INTEGER) {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
  }

  throw new Error(`unexpected type ${obj[FIELD_NAME.TYPE]}`)
}

function resolveReferenceObject (
  inputPath,
  openapiObject,
  paths,
  currentObject
) {
  if (paths.length > 1) {
    return resolveReferenceObject(
      inputPath,
      openapiObject,
      paths,
      currentObject[paths.shift()]
    )
  }

  return currentObject[paths.shift()]
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#reference-object
function parseReferenceObject (
  inputPath,
  openapiObject,
  reference
) {
  return resolveReferenceObject(
    inputPath,
    openapiObject,
    reference.split('/').slice(1),
    openapiObject
  )
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#schema-object
function parseSchemaObject (
  inputPath,
  openapiObject,
  _schemaObject
) {
  const nodes = []

  let schemaObject = {}
  if (FIELD_NAME.REF in _schemaObject) {
    schemaObject = parseReferenceObject(
      inputPath,
      openapiObject,
      _schemaObject[FIELD_NAME.REF]
    )
  } else {
    schemaObject = _schemaObject
  }

  if (typeof schemaObject[FIELD_NAME.PROPERTIES] !== 'object') {
    return nodes
  }

  for (const [key, value] of Object.entries(schemaObject[FIELD_NAME.PROPERTIES])) {
    const node = ts.factory.createPropertySignature(
      undefined,
      ts.factory.createIdentifier(key),
      undefined,
      toTypeNode(
        inputPath,
        openapiObject,
        FIELD_NAME.REF in value
          ? parseReferenceObject(
            inputPath,
            openapiObject,
            value[FIELD_NAME.REF]
          )
          : value
      )
    )

    nodes.push(node)
  }

  return nodes
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#response-object
function parseResponseObject (
  inputPath,
  openapiObject,
  path,
  method,
  operationId,
  statusCode,
  responseObject
) {
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#response-object
  // > REQUIRED. A short description of the response. CommonMark syntax MAY be used for rich text representation.
  if (typeof responseObject[FIELD_NAME.DESCRIPTION] !== 'string') {
    throw new Error('Response Object requires description.')
  }

  return ts.factory.createInterfaceDeclaration(
    [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(`${operationId}Reply${statusCode.charAt(0).toUpperCase() + statusCode.slice(1)}`),
    undefined,
    undefined,
    FIELD_NAME.SCHEMA in responseObject[FIELD_NAME.CONTENT][MEDIA_TYPE.APPLICATION_JSON]
      ? parseSchemaObject(
        inputPath,
        openapiObject,
        responseObject[FIELD_NAME.CONTENT][MEDIA_TYPE.APPLICATION_JSON][FIELD_NAME.SCHEMA]
      )
      : []
  )
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#responses-object
function parseResponsesObject (
  inputPath,
  openapiObject,
  path,
  method,
  operationId,
  responsesObject
) {
  const nodes = []
  for (const [statusCode, responseObject] of Object.entries(responsesObject)) {
    if (
      FIELD_NAME.CONTENT in responseObject &&
      MEDIA_TYPE.APPLICATION_JSON in responseObject[FIELD_NAME.CONTENT]
    ) {
      nodes.push(
        parseResponseObject(
          inputPath,
          openapiObject,
          path,
          method,
          operationId,
          statusCode,
          responseObject
        )
      )
    }
  }

  return nodes
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#operation-object
function parseOperationObject (
  inputPath,
  openapiObject,
  path,
  method,
  operationObject
) {
  const nodes = []

  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#operation-object
  // > REQUIRED. The list of possible responses as they are returned from executing this operation.
  if (FIELD_NAME.RESPONSES in operationObject === false) {
    throw new Error('Operation Object requires `responses` field.')
  }

  parseResponsesObject(
    inputPath,
    openapiObject,
    path,
    method,
    operationObject[FIELD_NAME.OPERATION_ID],
    operationObject[FIELD_NAME.RESPONSES]
  ).forEach(n => nodes.push(n))

  return nodes
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#path-item-object
function parsePathItemObject (
  inputPath,
  openapiObject,
  path,
  pathItemObject
) {
  const nodes = []

  const methods = Object.keys(pathItemObject).filter(k => HTTP_REQUEST_METHODS.includes(k))

  methods.forEach(method => {
    parseOperationObject(
      inputPath,
      openapiObject,
      path,
      method,
      pathItemObject[method]
    ).forEach(n => nodes.push(n))
  })

  return nodes
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#paths-object
function parsePathsObject (
  inputPath,
  openapiObject,
  pathsObject
) {
  const nodes = []

  for (const [path, pathItemObject] of Object.entries(pathsObject)) {
    parsePathItemObject(
      inputPath,
      openapiObject,
      path,
      pathItemObject
    ).forEach(n => nodes.push(n))
  }

  return nodes
}

module.exports = {
  parsePathsObject,
  toTypeNode
}
