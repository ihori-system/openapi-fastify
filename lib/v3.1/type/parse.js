const ts = require('typescript')
const {
  FIELD_NAME,
  OAS_DEFINED_TYPE,
  PRIMITIVE_TYPE
} = require('../constants')

// https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-00#section-4.2.1
function toTypeNode (
  inputPath,
  openapiObject,
  obj
) {
  if (obj[FIELD_NAME.TYPE] === PRIMITIVE_TYPE.STRING) {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword)
  }

  if (obj[FIELD_NAME.TYPE] === OAS_DEFINED_TYPE.INTEGER) {
    return ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)
  }

  throw new Error(`unexpected type ${obj[FIELD_NAME.TYPE]}`)
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#schema-object
function parseSchemaObject (
  inputPath,
  openapiObject,
  schemaObject
) {
  const nodes = []

  if (typeof schemaObject[FIELD_NAME.PROPERTIES] !== 'object') {
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
        value
      )
    )

    nodes.push(node)
  }

  return nodes
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#components-object-example
function parseComponentsObject (
  inputPath,
  openapiObject,
  componentsObject
) {
  const nodes = []

  if (typeof componentsObject[FIELD_NAME.SCHEMAS] === 'object') {
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

function parsePathsObject () {}

module.exports = {
  parseComponentsObject,
  parsePathsObject,
  toTypeNode
}
