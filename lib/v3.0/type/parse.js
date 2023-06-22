const ts = require('typescript')
const {
  FIELD_NAME,
  HTTP_REQUEST_METHODS,
  MEDIA_TYPE,
  OAS_DEFINED_TYPE,
  PARAMETER_LOCATION,
  PRIMITIVE_TYPE
} = require('../constants')

function toTypeNode (
  inputPath,
  openapiObject,
  obj
) {
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

  if (FIELD_NAME.PROPERTIES in schemaObject === false) {
    return nodes
  }

  const required = new Set(Array.isArray(schemaObject[FIELD_NAME.REQUIRED]) ? schemaObject[FIELD_NAME.REQUIRED] : [])

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

  let schemaObject = responseObject[FIELD_NAME.CONTENT][MEDIA_TYPE.APPLICATION_JSON][FIELD_NAME.SCHEMA]
  if (FIELD_NAME.REF in schemaObject) {
    schemaObject = parseReferenceObject(
      inputPath,
      openapiObject,
      schemaObject[FIELD_NAME.REF]
    )
  }

  if (schemaObject[FIELD_NAME.TYPE] === 'object') {
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
  path,
  method,
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

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#request-body-object
function parseRequestBodyObject (
  inputPath,
  openapiObject,
  path,
  method,
  operationId,
  requestBodyObject
) {
  return ts.factory.createInterfaceDeclaration(
    [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createIdentifier(`${operationId}Body`),
    undefined,
    undefined,
    FIELD_NAME.SCHEMA in requestBodyObject[FIELD_NAME.CONTENT][MEDIA_TYPE.APPLICATION_JSON]
      ? parseSchemaObject(
        inputPath,
        openapiObject,
        requestBodyObject[FIELD_NAME.CONTENT][MEDIA_TYPE.APPLICATION_JSON][FIELD_NAME.SCHEMA]
      )
      : []
  )
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#parameter-object
function parseParameterObject (
  inputPath,
  openapiObject,
  path,
  method,
  operationId,
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

  if (typeof parameterObject[FIELD_NAME.DESCRIPTION] === 'string') {
    ts.addSyntheticLeadingComment(
      node,
      ts.SyntaxKind.SingleLineCommentTrivia,
      ` ${parameterObject[FIELD_NAME.DESCRIPTION]}`,
      true
    )
  }

  return node
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#parameter-object
function parseParameterObjects (
  inputPath,
  openapiObject,
  path,
  method,
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
          .filter(q => typeof q[FIELD_NAME.SCHEMA] === 'object')
          .map(q => parseParameterObject(
            inputPath,
            openapiObject,
            path,
            method,
            operationId,
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
          .filter(p => typeof p[FIELD_NAME.SCHEMA] === 'object')
          .map(p => parseParameterObject(
            inputPath,
            openapiObject,
            path,
            method,
            operationId,
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
          .filter(h => typeof h[FIELD_NAME.SCHEMA] === 'object')
          .map(h => parseParameterObject(
            inputPath,
            openapiObject,
            path,
            method,
            operationId,
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

  if (operationObject[FIELD_NAME.OPERATION_ID].includes('-')) {
    // openapi-fastify specific rule
    throw new Error('operationId must not contain dash.')
  }

  const nodes = []

  if (FIELD_NAME.REQUEST_BODY in operationObject) {
    if (FIELD_NAME.CONTENT in operationObject[FIELD_NAME.REQUEST_BODY] === false) {
      // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#request-body-object
      // > REQUIRED. The content of the request body. The key is a media type or media type range and the value describes it. For requests that match multiple keys, only the most specific key is applicable. e.g. text/plain overrides text/*
      throw new Error('Request Body Object requires content field.')
    }

    // https://fastify.dev/docs/latest/Reference/Validation-and-Serialization/
    // > Validation will only be attempted if the content type is application-json
    if (MEDIA_TYPE.APPLICATION_JSON in operationObject[FIELD_NAME.REQUEST_BODY][FIELD_NAME.CONTENT]) {
      nodes.push(
        parseRequestBodyObject(
          inputPath,
          openapiObject,
          path,
          method,
          operationObject[FIELD_NAME.OPERATION_ID],
          operationObject[FIELD_NAME.REQUEST_BODY]
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
    path,
    method,
    operationObject[FIELD_NAME.OPERATION_ID],
    parameterObjects
  ).forEach(n => nodes.push(n))

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

  const parameterObjects =
    Array.isArray(pathItemObject[FIELD_NAME.PARAMETERS])
      ? pathItemObject[FIELD_NAME.PARAMETERS]
      : []

  const methods = Object.keys(pathItemObject).filter(k => HTTP_REQUEST_METHODS.includes(k))

  methods.forEach(method => {
    parseOperationObject(
      inputPath,
      openapiObject,
      path,
      method,
      pathItemObject[method],
      parameterObjects
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
