const FIELD_NAME = {
  CONTENT: 'content',
  DESCRIPTION: 'description',
  FORMAT: 'format',
  INFO: 'info',
  ITEMS: 'items',
  MAX_ITEMS: 'maxItems',
  OPERATION_ID: 'operationId',
  PATHS: 'paths',
  PROPERTIES: 'properties',
  REF: '$ref',
  REQUIRED: 'required',
  RESPONSES: 'responses',
  SCHEMA: 'schema',
  TYPE: 'type'
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#path-item-object
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
