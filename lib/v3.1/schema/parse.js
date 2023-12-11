const ts = require('typescript')
const {
  FIELD_NAME,
  HTTP_REQUEST_METHODS,
  MEDIA_TYPE,
  OAS_DEFINED_TYPE,
  PARAMETER_LOCATION,
  PRIMITIVE_TYPE
} = require('../constants')
const {
  parseReferenceObject
} = require('../parseReferenceObject')
const {
  valueToLiteral
} = require('../valueToLiteral')

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

  // https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#section-6.1.1
  // > The value of this keyword MUST be either a string or an array.  If it is an array, elements of the array MUST be strings and MUST be unique.
  if (typeof schemaObject[FIELD_NAME.TYPE] === 'string') {
    nodes.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('type'),
        ts.factory.createStringLiteral(schemaObject[FIELD_NAME.TYPE])
      )
    )
  }
  if (Array.isArray(schemaObject[FIELD_NAME.TYPE])) {
    nodes.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('type'),
        ts.factory.createArrayLiteralExpression(
          schemaObject[FIELD_NAME.TYPE]
            .map(t => ts.factory.createStringLiteral(t)),
          true
        )
      )
    )
  }

  // https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#section-6.1.2
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

  const types =
    typeof schemaObject[FIELD_NAME.TYPE] === 'string'
      ? [schemaObject[FIELD_NAME.TYPE]]
      : Array.isArray(schemaObject[FIELD_NAME.TYPE])
        ? schemaObject[FIELD_NAME.TYPE]
        : []

  types.forEach(t => {
    // https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#section-6.2
    // > Validation Keywords for Numeric Instances (number and integer)
    if (
      t === PRIMITIVE_TYPE.NUMBER ||
      t === OAS_DEFINED_TYPE.INTEGER) {
      // https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#section-6.2.1
      // > The value of "multipleOf" MUST be a number, strictly greater than 0.
      if (FIELD_NAME.MULTIPLE_OF in schemaObject) {
        nodes.push(
          ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier('multipleOf'),
            ts.factory.createNumericLiteral(schemaObject[FIELD_NAME.MULTIPLE_OF])
          )
        )
      }

      // https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#section-6.2.2
      // > The value of "maximum" MUST be a number, representing an inclusive upper limit for a numeric instance.
      if (FIELD_NAME.MAXIMUM in schemaObject) {
        nodes.push(
          ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier('maximum'),
            ts.factory.createNumericLiteral(schemaObject[FIELD_NAME.MAXIMUM])
          )
        )
      }

      // https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#section-6.2.3
      // > The value of "exclusiveMaximum" MUST be a number, representing an exclusive upper limit for a numeric instance.
      if (FIELD_NAME.EXCLUSIVE_MAXIMUM in schemaObject) {
        nodes.push(
          ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier('exclusiveMaximum'),
            ts.factory.createNumericLiteral(schemaObject[FIELD_NAME.EXCLUSIVE_MAXIMUM])
          )
        )
      }

      // https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#section-6.2.4
      // > The value of "minimum" MUST be a number, representing an inclusive lower limit for a numeric instance.
      if (FIELD_NAME.MINIMUM in schemaObject) {
        nodes.push(
          ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier('minimum'),
            ts.factory.createNumericLiteral(schemaObject[FIELD_NAME.MINIMUM])
          )
        )
      }

      // https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#section-6.2.5
      // > The value of "exclusiveMinimum" MUST be a number, representing an exclusive lower limit for a numeric instance.
      if (FIELD_NAME.EXCLUSIVE_MINIMUM in schemaObject) {
        nodes.push(
          ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier('exclusiveMinimum'),
            ts.factory.createNumericLiteral(schemaObject[FIELD_NAME.EXCLUSIVE_MINIMUM])
          )
        )
      }
    }

    // https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#section-6.3
    // > Validation Keywords for Strings
    if (t === PRIMITIVE_TYPE.STRING) {
      // https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#section-6.3.1
      // > The value of this keyword MUST be a non-negative integer.
      if (FIELD_NAME.MAX_LENGTH in schemaObject) {
        nodes.push(
          ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier('maxLength'),
            ts.factory.createNumericLiteral(schemaObject[FIELD_NAME.MAX_LENGTH])
          )
        )
      }

      // https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#section-6.3.2
      // > The value of this keyword MUST be a non-negative integer.
      if (FIELD_NAME.MIN_LENGTH in schemaObject) {
        nodes.push(
          ts.factory.createPropertyAssignment(
            ts.factory.createIdentifier('minLength'),
            ts.factory.createNumericLiteral(schemaObject[FIELD_NAME.MIN_LENGTH])
          )
        )
      }

      // https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-validation-00#section-6.3.3
      // > The value of this keyword MUST be a string.  This string SHOULD be a valid regular expression, according to the ECMA-262 regular expression dialect.
      // TODO: support `pattern`
    }
  })

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
            FIELD_NAME.REF in schemaObject[FIELD_NAME.ITEMS]
              ? parseReferenceObject(
                inputPath,
                openapiObject,
                schemaObject[FIELD_NAME.ITEMS][FIELD_NAME.REF]
              )
              : schemaObject[FIELD_NAME.ITEMS]
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

  if (FIELD_NAME.ADDITIONAL_PROPERTIES in schemaObject) {
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

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#response-object
function parseResponseObject (
  inputPath,
  openapiObject,
  path,
  method,
  statusCode,
  responseObject
) {
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#response-object
  // > REQUIRED. A description of the response. CommonMark syntax MAY be used for rich text representation.
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
            statusCode,
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

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#request-body-object
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
          .filter(po => FIELD_NAME.SCHEMA in po)
          .map(po => ts.factory.createPropertyAssignment(
            ts.factory.createStringLiteral(po[FIELD_NAME.NAME]),
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
  _parameterObjects
) {
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
      // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#request-body-object
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

  if (FIELD_NAME.RESPONSES in operationObject) {
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
