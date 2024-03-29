const ts = require('typescript')
const {
  FIELD_NAME,
  HTTP_REQUEST_METHODS,
  MEDIA_TYPE,
  PARAMETER_LOCATION,
  PRIMITIVE_TYPE
} = require('../constants')
const {
  parseReferenceObject
} = require('../parseReferenceObject')
const {
  valueToLiteral
} = require('../valueToLiteral')

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
    parseSchemaObjectProperties(
      inputPath,
      openapiObject,
      path,
      method,
      parseReferenceObject(
        inputPath,
        openapiObject,
        schemaObject[FIELD_NAME.REF]
      )
    ).forEach(n => nodes.push(n))
  }

  // https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.20
  if (FIELD_NAME.ENUM in schemaObject) {
    // > The value of this keyword MUST be an array.
    if (!Array.isArray(schemaObject[FIELD_NAME.ENUM])) {
      throw new Error('enum must be an array.')
    }
    nodes.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('enum'),
        ts.factory.createArrayLiteralExpression(
          schemaObject[FIELD_NAME.ENUM]
            .map(e => valueToLiteral(e)),
          true
        )
      )
    )
  }

  // https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.21
  if (typeof schemaObject[FIELD_NAME.TYPE] === 'string') {
    // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#data-types
    // > null is not supported as a type
    if (schemaObject[FIELD_NAME.TYPE] === PRIMITIVE_TYPE.NULL) {
      throw new Error('null is not supported as a type')
    }
    nodes.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('type'),
        ts.factory.createStringLiteral(schemaObject[FIELD_NAME.TYPE])
      )
    )

    // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#fixed-fields-20
    // > A true value adds "null" to the allowed type specified by the type keyword, only if type is explicitly defined within the same Schema Object.
    if (FIELD_NAME.NULLABLE in schemaObject) {
      nodes.push(
        ts.factory.createPropertyAssignment(
          ts.factory.createIdentifier('nullable'),
          valueToLiteral(schemaObject[FIELD_NAME.NULLABLE])
        )
      )
    }
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

  if (schemaObject[FIELD_NAME.TYPE] === PRIMITIVE_TYPE.STRING) {
    // https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.6
    // > A string instance is valid against this keyword if its length is less
    // > than, or equal to, the value of this keyword.
    if (FIELD_NAME.MAX_LENGTH in schemaObject) {
      nodes.push(
        ts.factory.createPropertyAssignment(
          ts.factory.createIdentifier('maxLength'),
          ts.factory.createNumericLiteral(schemaObject[FIELD_NAME.MAX_LENGTH])
        )
      )
    }

    // https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.7
    // > A string instance is valid against this keyword if its length is
    // > greater than, or equal to, the value of this keyword.
    if (FIELD_NAME.MIN_LENGTH in schemaObject) {
      nodes.push(
        ts.factory.createPropertyAssignment(
          ts.factory.createIdentifier('minLength'),
          ts.factory.createNumericLiteral(schemaObject[FIELD_NAME.MIN_LENGTH])
        )
      )
    }
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
    Object.entries(responseObject[FIELD_NAME.CONTENT])
      // https://fastify.dev/docs/latest/Reference/Validation-and-Serialization#serialization
      // > Usually, you will send your data to the clients as JSON, and Fastify has a powerful tool to help you, fast-json-stringify, which is used if you have provided an output schema in the route options.
      .filter(([mediaType]) => mediaType === MEDIA_TYPE.APPLICATION_JSON)
      .forEach(([mediaType, mediaTypeObject]) => {
        nodes.push(
          parseMediaTypeObject(
            inputPath,
            openapiObject,
            path,
            method,
            mediaType,
            mediaTypeObject
          )
        )
      })
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
        FIELD_NAME.REF in responseObject
          ? parseReferenceObject(
            inputPath,
            openapiObject,
            responseObject[FIELD_NAME.REF]
          )
          : responseObject
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

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#request-body-object
function parseRequestBodyObject (
  inputPath,
  openapiObject,
  path,
  method,
  requestBodyObject
) {
  return ts.factory.createPropertyAssignment(
    ts.factory.createIdentifier('body'),
    ts.factory.createObjectLiteralExpression(
      parseSchemaObjectProperties(
        inputPath,
        openapiObject,
        path,
        method,
        requestBodyObject[FIELD_NAME.CONTENT][MEDIA_TYPE.APPLICATION_JSON][FIELD_NAME.SCHEMA]
      ),
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
          .filter(po => FIELD_NAME.SCHEMA in po)
          .map(po => ts.factory.createPropertyAssignment(
            ts.factory.createStringLiteral(po.name),
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

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#operation-object
function parseOperationObject (
  inputPath,
  openapiObject,
  path,
  method,
  operationObject,
  _parameterObjects
) {
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#operation-object
  // > REQUIRED. The list of possible responses as they are returned from executing this operation.
  if (FIELD_NAME.RESPONSES in operationObject === false) {
    throw new Error('Operation Object requires `responses` field.')
  }

  // openapi-fastify specific rule
  if (FIELD_NAME.OPERATION_ID in operationObject === false) {
    throw new Error('Operation Object requires `operationId` field.')
  }

  // openapi-fastify specific rule
  if (operationObject[FIELD_NAME.OPERATION_ID].includes(' ')) {
    throw new Error('operationId must not contain white space.')
  }

  // openapi-fastify specific rule
  if (operationObject[FIELD_NAME.OPERATION_ID].includes('-')) {
    throw new Error('operationId must not contain dash.')
  }

  const nodes = []

  if (FIELD_NAME.REQUEST_BODY in operationObject) {
    const requestBodyObject =
      FIELD_NAME.REF in operationObject[FIELD_NAME.REQUEST_BODY]
        ? parseReferenceObject(
          inputPath,
          openapiObject,
          operationObject[FIELD_NAME.REQUEST_BODY][FIELD_NAME.REF]
        )
        : operationObject[FIELD_NAME.REQUEST_BODY]

    if (FIELD_NAME.CONTENT in requestBodyObject === false) {
      // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#request-body-object
      // > REQUIRED. The content of the request body. The key is a media type or media type range and the value describes it. For requests that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/*
      throw new Error(`Request Body Object requires content field. Object: ${JSON.stringify(requestBodyObject)}`)
    }

    if (
      // https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/#validation
      // > body: validates the body of the request if it is a POST, PUT, or PATCH method.
      ['post', 'put', 'path'].includes(method) &&
      // https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/
      // > Validation will only be attempted if the content type is application-json
      MEDIA_TYPE.APPLICATION_JSON in requestBodyObject[FIELD_NAME.CONTENT] &&
      FIELD_NAME.SCHEMA in requestBodyObject[FIELD_NAME.CONTENT][MEDIA_TYPE.APPLICATION_JSON]
    ) {
      nodes.push(
        parseRequestBodyObject(
          inputPath,
          openapiObject,
          path,
          method,
          requestBodyObject
        )
      )
    }
  }

  const parameterObjects = [..._parameterObjects]
  if (Array.isArray(operationObject[FIELD_NAME.PARAMETERS])) {
    operationObject[FIELD_NAME.PARAMETERS].forEach(po => parameterObjects.push(po))
  }

  parseParameterObjects(
    inputPath,
    operationObject,
    path,
    method,
    parameterObjects.map(
      po => FIELD_NAME.REF in po
        ? parseReferenceObject(
          inputPath,
          openapiObject,
          po[FIELD_NAME.REF]
        )
        : po
    )
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

  const parameterObjects =
    Array.isArray(pathItemObject[FIELD_NAME.PARAMETERS])
      ? pathItemObject[FIELD_NAME.PARAMETERS]
      : []

  const methods =
    Object.keys(pathItemObject).filter(k => HTTP_REQUEST_METHODS.includes(k))

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
  parsePathsObject,
  valueToLiteral
}
