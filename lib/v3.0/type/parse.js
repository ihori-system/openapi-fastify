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

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#data-types
function toOASTypeNode (type) {
  if (type === OAS_DEFINED_TYPE.INTEGER) {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
  }

  throw new Error(`unexpected OAS defined type ${JSON.stringify(type)}`)
}

// https://datatracker.ietf.org/doc/html/draft-wright-json-schema-00#section-4.2
function toPrimitiveTypeNode (type) {
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#data-types
  // > null is not supported as a type
  if (type === PRIMITIVE_TYPE.NULL) {
    throw new Error('null is not supported as a type')
  }

  if (type === PRIMITIVE_TYPE.BOOLEAN) {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword)
  }

  if (type === PRIMITIVE_TYPE.NUMBER) {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
  }

  if (type === PRIMITIVE_TYPE.STRING) {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
  }

  throw new Error(`unexpected primitive type ${JSON.stringify(type)}`)
}

// https://datatracker.ietf.org/doc/html/draft-wright-json-schema-validation-00#section-5.21
function toTypeNode (
  inputPath,
  openapiObject,
  obj
) {
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#data-types
  // > null is not supported as a type
  if (obj[FIELD_NAME.TYPE] === PRIMITIVE_TYPE.NULL) {
    throw new Error('null is not supported as a type')
  }

  if (Array.isArray(obj[FIELD_NAME.ENUM])) {
    return ts.factory.createUnionTypeNode(
      obj[FIELD_NAME.ENUM].map(e => ts.factory.createLiteralTypeNode(
        ts.factory.createStringLiteral(e)
      ))
    )
  }

  if (obj[FIELD_NAME.TYPE] === PRIMITIVE_TYPE.OBJECT) {
    return ts.factory.createTypeLiteralNode(
      parseSchemaObject(
        inputPath,
        openapiObject,
        obj
      )
    )
  }

  if (obj[FIELD_NAME.TYPE] === PRIMITIVE_TYPE.ARRAY) {
    if (FIELD_NAME.ITEMS in obj) {
      return ts.factory.createArrayTypeNode(
        toTypeNode(
          inputPath,
          openapiObject,
          FIELD_NAME.REF in obj[FIELD_NAME.ITEMS]
            ? parseReferenceObject(
              inputPath,
              openapiObject,
              obj[FIELD_NAME.ITEMS][FIELD_NAME.REF]
            )
            : obj[FIELD_NAME.ITEMS]
        )
      )
    } else {
      return ts.factory.createTupleTypeNode()
    }
  }

  if (Object.values(PRIMITIVE_TYPE).includes(obj[FIELD_NAME.TYPE])) {
    if (FIELD_NAME.NULLABLE in obj && obj[FIELD_NAME.NULLABLE] === true) {
      return ts.factory.createUnionTypeNode(
        [
          toPrimitiveTypeNode(obj[FIELD_NAME.TYPE]),
          ts.factory.createLiteralTypeNode(ts.factory.createNull())
        ]
      )
    }
    return toPrimitiveTypeNode(obj[FIELD_NAME.TYPE])
  }

  if (Object.values(OAS_DEFINED_TYPE).includes(obj[FIELD_NAME.TYPE])) {
    if (FIELD_NAME.NULLABLE in obj && obj[FIELD_NAME.NULLABLE] === true) {
      return ts.factory.createUnionTypeNode(
        [
          toOASTypeNode(obj[FIELD_NAME.TYPE]),
          ts.factory.createLiteralTypeNode(ts.factory.createNull())
        ]
      )
    }
    return toOASTypeNode(obj[FIELD_NAME.TYPE])
  }

  throw new Error(`unexpected type. obj: ${JSON.stringify(obj)}, type: ${JSON.stringify(obj[FIELD_NAME.TYPE])}`)
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

  if (FIELD_NAME.PROPERTIES in schemaObject === false) {
    return nodes
  }

  const required =
    new Set(Array.isArray(schemaObject[FIELD_NAME.REQUIRED]) ? schemaObject[FIELD_NAME.REQUIRED] : [])

  for (const [key, value] of Object.entries(schemaObject[FIELD_NAME.PROPERTIES])) {
    const node = ts.factory.createPropertySignature(
      undefined,
      ts.factory.createIdentifier(key),
      required.has(key) ? undefined : ts.factory.createToken(ts.SyntaxKind.QuestionToken),
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

    if (typeof value[FIELD_NAME.DESCRIPTION] === 'string') {
      ts.addSyntheticLeadingComment(
        node,
        ts.SyntaxKind.SingleLineCommentTrivia,
        ` ${value[FIELD_NAME.DESCRIPTION]}`
      )
    }

    nodes.push(node)
  }

  return nodes
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#response-object
function parseResponseObject (
  inputPath,
  openapiObject,
  operationId,
  statusCode,
  responseObject
) {
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#response-object
  // > REQUIRED. A short description of the response. CommonMark syntax MAY be used for rich text representation.
  if (typeof responseObject[FIELD_NAME.DESCRIPTION] !== 'string') {
    throw new Error('Response Object requires description.')
  }

  let schemaObject = responseObject[FIELD_NAME.CONTENT][MEDIA_TYPE.APPLICATION_JSON][FIELD_NAME.SCHEMA]
  if (FIELD_NAME.REF in schemaObject) {
    schemaObject = parseReferenceObject(
      inputPath,
      openapiObject,
      schemaObject[FIELD_NAME.REF]
    )
  }

  if (schemaObject[FIELD_NAME.TYPE] === PRIMITIVE_TYPE.OBJECT) {
    return ts.factory.createInterfaceDeclaration(
      [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
      ts.factory.createIdentifier(`${operationId}Reply${statusCode.charAt(0).toUpperCase() + statusCode.slice(1)}`),
      undefined,
      undefined,
      parseSchemaObject(
        inputPath,
        openapiObject,
        responseObject[FIELD_NAME.CONTENT][MEDIA_TYPE.APPLICATION_JSON][FIELD_NAME.SCHEMA]
      )
    )
  }

  return ts.factory.createTypeAliasDeclaration(
    [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(`${operationId}Reply${statusCode.charAt(0).toUpperCase() + statusCode.slice(1)}`),
    undefined,
    toTypeNode(
      inputPath,
      openapiObject,
      schemaObject
    )
  )
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#responses-object
function parseResponsesObject (
  inputPath,
  openapiObject,
  operationId,
  responsesObject
) {
  const nodes = []

  for (const [statusCode, responseObject] of Object.entries(responsesObject)) {
    if (
      FIELD_NAME.CONTENT in responseObject &&
      MEDIA_TYPE.APPLICATION_JSON in responseObject[FIELD_NAME.CONTENT] &&
      FIELD_NAME.SCHEMA in responseObject[FIELD_NAME.CONTENT][MEDIA_TYPE.APPLICATION_JSON]
    ) {
      nodes.push(
        parseResponseObject(
          inputPath,
          openapiObject,
          operationId,
          statusCode,
          responseObject
        )
      )
    }
  }

  return nodes
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#request-body-object
function parseRequestBodyObject (
  inputPath,
  openapiObject,
  operationId,
  requestBodyObject
) {
  return ts.factory.createInterfaceDeclaration(
    [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(`${operationId}Body`),
    undefined,
    undefined,
    parseSchemaObject(
      inputPath,
      openapiObject,
      requestBodyObject[FIELD_NAME.CONTENT][MEDIA_TYPE.APPLICATION_JSON][FIELD_NAME.SCHEMA]
    )
  )
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#parameter-object
function parseParameterObject (
  inputPath,
  openapiObject,
  parameterObject
) {
  const node = ts.factory.createPropertySignature(
    undefined,
    ts.factory.createIdentifier(parameterObject.name),
    parameterObject.required ? undefined : ts.factory.createToken(ts.SyntaxKind.QuestionToken),
    toTypeNode(
      inputPath,
      openapiObject,
      parameterObject[FIELD_NAME.SCHEMA]
    )
  )

  if (
    typeof parameterObject[FIELD_NAME.DESCRIPTION] === 'string' &&
    parameterObject[FIELD_NAME.DESCRIPTION].length > 0
  ) {
    ts.addSyntheticLeadingComment(
      node,
      ts.SyntaxKind.SingleLineCommentTrivia,
      ` ${parameterObject[FIELD_NAME.DESCRIPTION].trim()}`,
      true
    )
  }

  return node
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#parameter-object
function parseParameterObjects (
  inputPath,
  openapiObject,
  operationId,
  parameterObjects
) {
  const nodes = []

  const queries = parameterObjects.filter(po => po[FIELD_NAME.IN] === PARAMETER_LOCATION.QUERY)
  if (queries.length > 0) {
    nodes.push(
      ts.factory.createInterfaceDeclaration(
        [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier(`${operationId}Querystring`),
        undefined,
        undefined,
        queries
          // TODO: support `content`.
          .filter(q => FIELD_NAME.SCHEMA in q)
          .map(q => parseParameterObject(
            inputPath,
            openapiObject,
            q
          ))
      )
    )
  }

  const params = parameterObjects.filter(po => po[FIELD_NAME.IN] === PARAMETER_LOCATION.PATH)
  if (params.length > 0) {
    nodes.push(
      ts.factory.createInterfaceDeclaration(
        [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier(`${operationId}Params`),
        undefined,
        undefined,
        params
          // TODO: support `content`.
          .filter(p => FIELD_NAME.SCHEMA in p)
          .map(p => parseParameterObject(
            inputPath,
            openapiObject,
            p
          ))
      )
    )
  }

  const headers = parameterObjects.filter(po => po[FIELD_NAME.IN] === PARAMETER_LOCATION.HEADER)
  if (headers.length > 0) {
    nodes.push(
      ts.factory.createInterfaceDeclaration(
        [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
        ts.factory.createIdentifier(`${operationId}Headers`),
        undefined,
        undefined,
        headers
          // TODO: support `content`.
          .filter(h => FIELD_NAME.SCHEMA in h)
          .map(h => parseParameterObject(
            inputPath,
            openapiObject,
            h
          ))
      )
    )
  }

  return nodes
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#operation-object
function parseOperationObject (
  inputPath,
  openapiObject,
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
          operationObject[FIELD_NAME.OPERATION_ID],
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
    openapiObject,
    operationObject[FIELD_NAME.OPERATION_ID],
    parameterObjects
  ).forEach(n => nodes.push(n))

  parseResponsesObject(
    inputPath,
    openapiObject,
    operationObject[FIELD_NAME.OPERATION_ID],
    operationObject[FIELD_NAME.RESPONSES]
  ).forEach(n => nodes.push(n))

  return nodes
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#path-item-object
function parsePathItemObject (
  inputPath,
  openapiObject,
  pathItemObject
) {
  const nodes = []

  const parameterObjects =
    Array.isArray(pathItemObject[FIELD_NAME.PARAMETERS])
      ? pathItemObject[FIELD_NAME.PARAMETERS]
      : []

  const methods = Object.keys(pathItemObject).filter(k => HTTP_REQUEST_METHODS.includes(k))

  methods.forEach(method => {
    parseOperationObject(
      inputPath,
      openapiObject,
      method,
      pathItemObject[method],
      parameterObjects
    ).forEach(n => nodes.push(n))
  })

  return nodes
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#components-object
function parseComponentsObject (
  inputPath,
  openapiObject,
  componentsObject
) {
  const nodes = []

  if (FIELD_NAME.SCHEMAS in componentsObject) {
    for (const [schema, schemaObject] of Object.entries(componentsObject[FIELD_NAME.SCHEMAS])) {
      nodes.push(
        ts.factory.createInterfaceDeclaration(
          [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
          ts.factory.createIdentifier(`${schema}Schema`),
          undefined,
          undefined,
          parseSchemaObject(
            inputPath,
            openapiObject,
            schemaObject
          )
        )
      )
    }
  }

  return nodes
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#paths-object
function parsePathsObject (
  inputPath,
  openapiObject,
  pathsObject
) {
  const nodes = []

  for (const [, pathItemObject] of Object.entries(pathsObject)) {
    parsePathItemObject(
      inputPath,
      openapiObject,
      pathItemObject
    ).forEach(n => nodes.push(n))
  }

  return nodes
}

module.exports = {
  parseComponentsObject,
  parsePathsObject,
  toOASTypeNode,
  toPrimitiveTypeNode,
  toTypeNode
}
