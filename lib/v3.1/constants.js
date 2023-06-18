const FIELD_NAME = {
  CONTENT: 'content',
  ITEMS: 'items',
  OPERATION_ID: 'operationId',
  PATHS: 'paths',
  REF: '$ref',
  RESPONSES: 'responses',
  SCHEMA: 'schema',
  TYPE: 'type'
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#path-item-object
const HTTP_REQUEST_METHODS = [
  'get',
  'put',
  'post',
  'delete',
  'options',
  'head',
  'patch',
  'trace'
]

module.exports = {
  FIELD_NAME,
  HTTP_REQUEST_METHODS
}
