const ts = require('typescript')
const {
  FIELD_NAME,
  HTTP_REQUEST_METHODS,
  PARAMETER_LOCATION
} = require('../constants')

function resolveReferenceObject (
  inputPath,
  openapiObject,
  path,
  method,
  paths,
  currentObject
) {
  if (paths.length > 1) {
    return resolveReferenceObject(
      inputPath,
      openapiObject,
      path,
      method,
      paths,
      currentObject[paths.shift()]
    )
  }

  return parseSchemaObjectProperties(
    inputPath,
    openapiObject,
    path,
    method,
    currentObject[paths.shift()]
  )
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#reference-object
function parseReferenceObject (
  inputPath,
  openapiObject,
  path,
  method,
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
  schemaObject
) {
  const nodes = []

  if (FIELD_NAME.REF in schemaObject) {
    parseReferenceObject(
      inputPath,
      openapiObject,
      path,
      method,
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

  if (typeof schemaObject[FIELD_NAME.FORMAT] === 'string') {
    nodes.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('format'),
        ts.factory.createStringLiteral(schemaObject[FIELD_NAME.FORMAT])
      )
    )
  }

  // https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.2
  if (FIELD_NAME.MAXIMUM in schemaObject) {
    nodes.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('maximum'),
        ts.factory.createNumericLiteral(schemaObject[FIELD_NAME.MAXIMUM])
      )
    )
  }

  // https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.10
  if (FIELD_NAME.MAX_ITEMS in schemaObject) {
    nodes.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('maxItems'),
        ts.factory.createNumericLiteral(schemaObject[FIELD_NAME.MAX_ITEMS])
      )
    )
  }

  if (FIELD_NAME.ITEMS in schemaObject) {
    nodes.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('items'),
        ts.factory.createObjectLiteralExpression(
          parseSchemaObjectProperties(
            inputPath,
            openapiObject,
            path,
            method,
            schemaObject[FIELD_NAME.ITEMS]
          ),
          true
        )
      )
    )
  }

  if (Array.isArray(schemaObject[FIELD_NAME.REQUIRED])) {
    nodes.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('required'),
        ts.factory.createArrayLiteralExpression(
          schemaObject[FIELD_NAME.REQUIRED]
            .map(r => ts.factory.createStringLiteral(r)),
          true
        )
      )
    )
  }

  if (FIELD_NAME.PROPERTIES in schemaObject) {
    nodes.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('properties'),
        ts.factory.createObjectLiteralExpression(
          Object.keys(schemaObject[FIELD_NAME.PROPERTIES])
            .map(k => ts.factory.createPropertyAssignment(
              ts.factory.createIdentifier(k),
              ts.factory.createObjectLiteralExpression(
                parseSchemaObjectProperties(
                  inputPath,
                  openapiObject,
                  path,
                  method,
                  schemaObject[FIELD_NAME.PROPERTIES][k]
                ),
                true
              )
            )),
          true
        )
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

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#parameter-object
function parseParameterObject (
  inputPath,
  openapiObject,
  path,
  method,
  parameterObjects
) {
  const nodes = []

  nodes.push(
    ts.factory.createPropertyAssignment(
      ts.factory.createIdentifier('type'),
      ts.factory.createStringLiteral('object')
    )
  )

  const requiredParameterNames =
    parameterObjects
      .filter(po => po.required)
      .map(po => po.name)

  if (requiredParameterNames.length > 0) {
    nodes.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('required'),
        ts.factory.createArrayLiteralExpression(
          requiredParameterNames
            .map(n => ts.factory.createStringLiteral(n)),
          true
        )
      )
    )
  }

  nodes.push(
    ts.factory.createPropertyAssignment(
      ts.factory.createIdentifier('properties'),
      ts.factory.createObjectLiteralExpression(
        parameterObjects
          // TODO: consider to support `content`
          // .filter(po => FIELD_NAME.SCHEMA in po)
          .map(po => ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier(po.name),
            ts.factory.createObjectLiteralExpression(
              parseSchemaObjectProperties(
                inputPath,
                openapiObject,
                path,
                method,
                po[FIELD_NAME.SCHEMA]
              ),
              true
            )
          )),
        true
      )
    )
  )

  return ts.factory.createObjectLiteralExpression(
    nodes,
    true
  )
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#parameter-object
function parseParameterObjects (
  inputPath,
  openapiObject,
  path,
  method,
  parameterObjects
) {
  const nodes = []

  const queries = parameterObjects.filter(po => po[FIELD_NAME.IN] === PARAMETER_LOCATION.QUERY)
  if (queries.length > 0) {
    nodes.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('querystring'),
        parseParameterObject(
          inputPath,
          openapiObject,
          path,
          method,
          queries
        )
      )
    )
  }

  const params = parameterObjects.filter(po => po[FIELD_NAME.IN] === PARAMETER_LOCATION.PATH)
  if (params.length > 0) {
    nodes.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('params'),
        parseParameterObject(
          inputPath,
          openapiObject,
          path,
          method,
          params
        )
      )
    )
  }

  const headers = parameterObjects.filter(po => po[FIELD_NAME.IN] === PARAMETER_LOCATION.PATH)
  if (headers.length > 0) {
    nodes.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('headers'),
        parseParameterObject(
          inputPath,
          openapiObject,
          path,
          method,
          params
        )
      )
    )
  }

  return nodes
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#operation-object
function parseOperationObject (
  inputPath,
  openapiObject,
  path,
  method,
  operationObject,
  _parameterObjects
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

  if (operationObject[FIELD_NAME.OPERATION_ID].includes('-')) {
    // openapi-fastify specific rule
    throw new Error('operationId must not contain dash.')
  }

  const parameterObjects = []
  if (Array.isArray(operationObject[FIELD_NAME.PARAMETERS])) {
    operationObject[FIELD_NAME.PARAMETERS].forEach(po => parameterObjects.push(po))
  }

  parseParameterObjects(
    inputPath,
    operationObject,
    path,
    method,
    parameterObjects
  ).forEach(n => nodes.push(n))

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

  const parameterObjects = []

  const keys = Object.keys(pathItemObject)

  const methods = keys.filter(k => HTTP_REQUEST_METHODS.includes(k))

  methods.forEach(method => {
    nodes.push(
      parseOperationObject(
        inputPath,
        openapiObject,
        path,
        method,
        pathItemObject[method],
        parameterObjects
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
