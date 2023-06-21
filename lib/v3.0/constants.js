const FIELD_NAME = {
  CONTENT: 'content',
  DESCRIPTION: 'description',
  ENUM: 'enum',
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

const MEDIA_TYPE = {
  APPLICATION_JSON: 'application/json'
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#data-types
const OAS_DEFINED_TYPE = {
  INTEGER: 'integer'
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#parameter-object
const PARAMETER_LOCATION = {
  QUERY: 'query',
  HEADER: 'header',
  PATH: 'path',
  COOKIE: 'cookie'
}

// https://github.com/fastify/fast-json-stringify#fastjsonstringifyschema
const PRIMITIVE_TYPE = {
  NULL: 'null',
  BOOLEAN: 'boolean',
  OBJECT: 'object',
  ARRAY: 'array',
  NUMBER: 'number',
  STRING: 'string'
}

module.exports = {
  FIELD_NAME,
  HTTP_REQUEST_METHODS,
  MEDIA_TYPE,
  OAS_DEFINED_TYPE,
  PARAMETER_LOCATION,
  PRIMITIVE_TYPE
}
