const ts = require('typescript')
const {
  FIELD_NAME,
  HTTP_REQUEST_METHODS,
  MEDIA_TYPE,
  PARAMETER_LOCATION
} = require('../constants')

// https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-00#section-4.2.1
function valueToLiteral (value) {
  if (value === null) {
    return ts.factory.createNull()
  }

  if (value === true) {
    return ts.factory.createTrue()
  }

  if (value === false) {
    return ts.factory.createFalse()
  }

  if (typeof value === 'number') {
    return ts.factory.createNumericLiteral(value)
  }

  if (typeof value === 'string') {
    return ts.factory.createStringLiteral(value)
  }

  throw new Error(`unexpected default value type. [${typeof value}]`)
}

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

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#reference-object
function parseReferenceObject (
  inputPath,
  openapiObject,
  path,
  method,
  referenceObject
) {
  if (typeof referenceObject[FIELD_NAME.REF] !== 'string') {
    // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#reference-object
    // > REQUIRED. The reference identifier. This MUST be in the form of a URI.
    throw new Error(`The reference identifier is must be in the form of a URI. ${referenceObject[FIELD_NAME]}`)
  }

  return resolveReferenceObject(
    inputPath,
    openapiObject,
    path,
    method,
    referenceObject[FIELD_NAME.REF].split('/').slice(1),
    openapiObject
  )
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#schema-object
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
      schemaObject
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

  if (FIELD_NAME.DEFAULT in schemaObject) {
    nodes.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('default'),
        valueToLiteral(schemaObject[FIELD_NAME.DEFAULT])
      )
    )
  }

  if (typeof schemaObject[FIELD_NAME.ITEMS] === 'object') {
    nodes.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('items'),
        ts.factory.createObjectLiteralExpression(
          FIELD_NAME.REF in schemaObject[FIELD_NAME.ITEMS]
            ? parseReferenceObject(
              inputPath,
              openapiObject,
              path,
              method,
              schemaObject[FIELD_NAME.ITEMS]
            )
            : parseSchemaObjectProperties(
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

  if (typeof schemaObject[FIELD_NAME.PROPERTIES] === 'object') {
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

  if (typeof schemaObject[FIELD_NAME.ADDITIONAL_PROPERTIES] === 'object') {
    nodes.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('additionalProperties'),
        ts.factory.createObjectLiteralExpression(
          parseSchemaObjectProperties(
            inputPath,
            openapiObject,
            path,
            method,
            schemaObject[FIELD_NAME.ADDITIONAL_PROPERTIES]
          ),
          true
        )
      )
    )
  }

  return nodes
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#schema-object
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

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#media-type-object
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

  if (typeof mediaTypeObject[FIELD_NAME.SCHEMA] === 'object') {
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

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#response-object
function parseResponseObject (
  inputPath,
  openapiObject,
  path,
  method,
  statusCode,
  responseObject
) {
  const nodes = []
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

  return ts.factory.createPropertyAssignment(
    ts.factory.createIdentifier(statusCode),
    ts.factory.createObjectLiteralExpression(
      [
        ts.factory.createPropertyAssignment(
          ts.factory.createIdentifier('content'),
          ts.factory.createObjectLiteralExpression(
            nodes,
            true
          )
        )
      ],
      true
    )
  )
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#responses-object
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

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#request-body-object
function parseRequestBodyObject (
  inputPath,
  openapiObject,
  path,
  method,
  requestBodyObject
) {
  if (typeof requestBodyObject[FIELD_NAME.CONTENT] !== 'object') {
    // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#request-body-object
    // > REQUIRED. The content of the request body. The key is a media type or media type range and the value describes it. For requests that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/*
    throw new Error('Request Body Object requires content.')
  }

  const nodes = []

  if (
    // https://www.fastify.io/docs/latest/Reference/Validation-and-Serialization/#validation
    // > body: validates the body of the request if it is a POST, PUT, or PATCH method.
    ['post', 'put', 'path'].includes(method) &&
    // https://www.fastify.io/docs/latest/Reference/Validation-and-Serialization/
    // > Validation will only be attempted if the content type is application-json
    typeof requestBodyObject[FIELD_NAME.CONTENT][MEDIA_TYPE.APPLICATION_JSON] === 'object' &&
    typeof requestBodyObject[FIELD_NAME.CONTENT][MEDIA_TYPE.APPLICATION_JSON][FIELD_NAME.SCHEMA] === 'object'
  ) {
    parseSchemaObjectProperties(
      inputPath,
      openapiObject,
      path,
      method,
      requestBodyObject[FIELD_NAME.CONTENT][MEDIA_TYPE.APPLICATION_JSON][FIELD_NAME.SCHEMA]
    ).forEach(n => nodes.push(n))
  }

  return ts.factory.createPropertyAssignment(
    ts.factory.createIdentifier('body'),
    ts.factory.createObjectLiteralExpression(
      nodes,
      true
    )
  )
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameter-object
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
          .filter(po => typeof po[FIELD_NAME.SCHEMA] === 'object')
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

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameter-object
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

  const headers = parameterObjects.filter(po => po[FIELD_NAME.IN] === PARAMETER_LOCATION.HEADER)
  if (headers.length > 0) {
    nodes.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('headers'),
        parseParameterObject(
          inputPath,
          openapiObject,
          path,
          method,
          headers
        )
      )
    )
  }

  return nodes
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#operation-object
function parseOperationObject (
  inputPath,
  openapiObject,
  path,
  method,
  operationObject,
  parameterObjects
) {
  const nodes = []

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

  if (typeof operationObject[FIELD_NAME.REQUEST_BODY] === 'object') {
    nodes.push(
      parseRequestBodyObject(
        inputPath,
        openapiObject,
        path,
        method,
        operationObject[FIELD_NAME.REQUEST_BODY]
      )
    )
  }

  if (typeof operationObject[FIELD_NAME.RESPONSES] === 'object') {
    nodes.push(
      parseResponsesObject(
        inputPath,
        openapiObject,
        path,
        method,
        operationObject[FIELD_NAME.RESPONSES]
      )
    )
  }

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

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#path-item-object
function parsePathItemObject (
  inputPath,
  openapiObject,
  path,
  pathItemObject
) {
  const nodes = []

  const parameterObjects = Array.isArray(pathItemObject[FIELD_NAME.PARAMETERS])
    ? pathItemObject[FIELD_NAME.PARAMETERS]
    : []

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

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#paths-object
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
  valueToLiteral
}
