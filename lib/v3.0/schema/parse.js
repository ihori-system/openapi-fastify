const ts = require('typescript')
const {
  FIELD_NAME,
  HTTP_REQUEST_METHODS
} = require('../constants')

function resolveReferenceObject (
  inputPath,
  openapiObject,
  path,
  method,
  statusCode,
  mediaType,
  paths,
  currentObject
) {
  if (paths.length > 1) {
    return resolveReferenceObject(
      inputPath,
      openapiObject,
      path,
      method,
      statusCode,
      mediaType,
      paths,
      currentObject[paths.shift()]
    )
  }

  return parseSchemaObjectProperties(
    inputPath,
    openapiObject,
    path,
    method,
    statusCode,
    mediaType,
    currentObject[paths.shift()]
  )
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#reference-object
function parseReferenceObject (
  inputPath,
  openapiObject,
  path,
  method,
  statusCode,
  mediaType,
  reference
) {
  if (typeof reference !== 'string') {
    // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#reference-object
    // REQUIRED. The reference string.
    throw new Error(`The reference string must be string. Current value: ${reference}`)
  }

  return resolveReferenceObject(
    inputPath,
    openapiObject,
    path,
    method,
    statusCode,
    mediaType,
    reference.split('/').slice(1),
    openapiObject
  )
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#schema-object
function parseSchemaObjectProperties (
  inputPath,
  openapiObject,
  path,
  method,
  statusCode,
  mediaType,
  schemaObject
) {
  const nodes = []

  if (FIELD_NAME.REF in schemaObject) {
    parseReferenceObject(
      inputPath,
      openapiObject,
      path,
      method,
      statusCode,
      mediaType,
      schemaObject[FIELD_NAME.REF]
    ).forEach(n => nodes.push(n))
  }

  if (typeof schemaObject[FIELD_NAME.TYPE] === 'string') {
    nodes.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('type'),
        ts.factory.createStringLiteral(schemaObject[FIELD_NAME.TYPE])
      )
    )
  }

  return nodes
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#schema-object
function parseSchemaObject (
  inputPath,
  openapiObject,
  path,
  method,
  statusCode,
  mediaType,
  schemaObject
) {
  return ts.factory.createPropertyAssignment(
    ts.factory.createIdentifier('schema'),
    ts.factory.createObjectLiteralExpression(
      parseSchemaObjectProperties(
        inputPath,
        openapiObject,
        path,
        method,
        statusCode,
        mediaType,
        schemaObject
      ),
      true
    )
  )
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#response-object
function parseResponseObject (
  inputPath,
  openapiObject,
  path,
  method,
  statusCode,
  responseObject
) {
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#response-object
  // > REQUIRED. A short description of the response. CommonMark syntax MAY be used for rich text representation.
  if (typeof responseObject[FIELD_NAME.DESCRIPTION] !== 'string') {
    throw new Error('Response Object requires description.')
  }

  const nodes = []
  if (FIELD_NAME.CONTENT in responseObject) {
    for (const [mediaType, mediaTypeObject] of Object.entries(responseObject[FIELD_NAME.CONTENT])) {
      nodes.push(
        parseMediaTypeObject(
          inputPath,
          openapiObject,
          path,
          method,
          statusCode,
          mediaType,
          mediaTypeObject
        )
      )
    }
  }

  return ts.factory.createPropertyAssignment(
    ts.factory.createIdentifier(statusCode),
    ts.factory.createObjectLiteralExpression(
      FIELD_NAME.CONTENT in responseObject
        ? [
            ts.factory.createPropertyAssignment(
              ts.factory.createIdentifier('content'),
              ts.factory.createObjectLiteralExpression(
                nodes,
                true
              )
            )
          ]
        : [],
      true
    )
  )
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#responses-object
function parseResponsesObject (
  inputPath,
  openapiObject,
  path,
  method,
  responsesObject
) {
  const nodes = []

  for (const [statusCode, responseObject] of Object.entries(responsesObject)) {
    nodes.push(
      parseResponseObject(
        inputPath,
        openapiObject,
        path,
        method,
        statusCode,
        responseObject
      )
    )
  }

  return ts.factory.createPropertyAssignment(
    ts.factory.createIdentifier('response'),
    ts.factory.createObjectLiteralExpression(
      nodes,
      true
    )
  )
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#media-type-object
function parseMediaTypeObject (
  inputPath,
  openapiObject,
  path,
  method,
  statusCode,
  mediaType,
  mediaTypeObject
) {
  const nodes = []

  if (FIELD_NAME.SCHEMA in mediaTypeObject) {
    nodes.push(
      parseSchemaObject(
        inputPath,
        openapiObject,
        path,
        method,
        statusCode,
        mediaType,
        mediaTypeObject[FIELD_NAME.SCHEMA]
      )
    )
  }

  return ts.factory.createPropertyAssignment(
    ts.factory.createStringLiteral(mediaType),
    ts.factory.createObjectLiteralExpression(
      nodes,
      true
    )
  )
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

  if (FIELD_NAME.OPERATION_ID in operationObject === false) {
    // openapi-fastify specific rule
    throw new Error('Operation Object requires `operationId` field.')
  }

  if (operationObject[FIELD_NAME.OPERATION_ID].includes(' ')) {
    // openapi-fastify specific rule
    throw new Error('operationId must not contain white space.')
  }

  nodes.push(
    parseResponsesObject(
      inputPath,
      openapiObject,
      path,
      method,
      operationObject[FIELD_NAME.RESPONSES]
    )
  )

  return ts.factory.createVariableStatement(
    [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          ts.factory.createIdentifier(operationObject[FIELD_NAME.OPERATION_ID]),
          undefined,
          undefined,
          ts.factory.createObjectLiteralExpression(
            nodes,
            true
          )
        )
      ],
      ts.NodeFlags.Const
    )
  )
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#path-item-object
function parsePathItemObject (
  inputPath,
  openapiObject,
  path,
  pathItemObject
) {
  const nodes = []

  const keys = Object.keys(pathItemObject)

  const methods = keys.filter(k => HTTP_REQUEST_METHODS.includes(k))

  methods.forEach(method => {
    nodes.push(
      parseOperationObject(
        inputPath,
        openapiObject,
        path,
        method,
        pathItemObject[method]
      )
    )
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
  parsePathsObject
}
