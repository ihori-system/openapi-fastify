const FIELD_NAME = {
  CONTENT: 'content',
  DESCRIPTION: 'description',
  FORMAT: 'format',
  IN: 'in',
  INFO: 'info',
  ITEMS: 'items',
  MAX_ITEMS: 'maxItems',
  MAXIMUM: 'maximum',
  OPERATION_ID: 'operationId',
  PARAMETERS: 'parameters',
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

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#parameter-object
const PARAMETER_LOCATION = {
  QUERY: 'query',
  HEADER: 'header',
  PATH: 'path',
  COOKIE: 'cookie'
}

module.exports = {
  FIELD_NAME,
  HTTP_REQUEST_METHODS,
  PARAMETER_LOCATION
}
