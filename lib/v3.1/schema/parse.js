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

  if (typeof schemaObject[FIELD_NAME.TYPE] === 'string') {
    nodes.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('type'),
        ts.factory.createStringLiteral(schemaObject[FIELD_NAME.TYPE])
      )
    )
  }

  if (typeof schemaObject[FIELD_NAME.ITEMS] === 'object') {
    nodes.push(
      ts.factory.createPropertyAssignment(
        ts.factory.createIdentifier('items'),
        ts.factory.createObjectLiteralExpression(
          schemaObject[FIELD_NAME.ITEMS][FIELD_NAME.REF] != null
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
  return ts.factory.createPropertyAssignment(
    ts.factory.createStringLiteral(mediaType),
    ts.factory.createObjectLiteralExpression(
      [
        parseSchemaObject(
          inputPath,
          openapiObject,
          path,
          method,
          statusCode,
          mediaType,
          mediaTypeObject[FIELD_NAME.SCHEMA]
        )
      ],
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
        // ts.factory.createObjectLiteralExpression(
        //   params.map(p => parseParameterObject(
        //     inputPath,
        //     openapiObject,
        //     path,
        //     method,
        //     params
        //   )),
        //   true
        // )
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

  parseParameterObjects(
    inputPath,
    operationObject,
    path,
    method,
    parameterObjects
  ).forEach(n => nodes.push(n))

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
  parsePathsObject
}
