const ts = require('typescript')
const {
  FIELD_NAME,
  HTTP_REQUEST_METHODS
} = require('../constants')

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#operation-object
function parseOperationObject (
  openapiObject,
  path,
  method,
  operationObject
) {
  return ts.factory.createVariableStatement(
    [ts.factory.createToken(ts.SyntaxKind.ExportKeyword)],
    ts.factory.createVariableDeclarationList(
      [
        ts.factory.createVariableDeclaration(
          ts.factory.createIdentifier(operationObject[FIELD_NAME.OPERATION_ID]),
          undefined,
          undefined,
          ts.factory.createObjectLiteralExpression(
            [],
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
        openapiObject,
        path,
        method,
        pathItemObject[method]
      )
    )
  })

  return nodes
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#paths-object
function parsePathsObject (
  openapiObject,
  pathsObject
) {
  const nodes = []
  for (const [path, pathItemObject] of Object.entries(pathsObject)) {
    parsePathItemObject(
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
