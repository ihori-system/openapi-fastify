const ts = require('typescript')
const {
  FIELD_NAME,
  HTTP_REQUEST_METHODS
} = require('../constants')

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#operation-object
function parseOperationObject (
  inputPath,
  openapiObject,
  path,
  method,
  operationObject
) {
  const nodes = []

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
