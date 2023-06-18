const FIELD_NAME = {
  ADDITIONAL_PROPERTIES: 'additionalProperties',
  CONTENT: 'content',
  FORMAT: 'format',
  IN: 'in',
  ITEMS: 'items',
  OPERATION_ID: 'operationId',
  PARAMETERS: 'parameters',
  PATHS: 'paths',
  REF: '$ref',
  REQUEST_BODY: 'requestBody',
  REQUIRED: 'required',
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

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameter-object
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