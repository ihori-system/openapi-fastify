const FIELD_NAME = {
  ALL_OF: 'allOf',
  ADDITIONAL_PROPERTIES: 'additionalProperties',
  COMPONENTS: 'components',
  CONTENT: 'content',
  DEFAULT: 'default',
  DESCRIPTION: 'description',
  ENUM: 'enum',
  EXCLUSIVE_MAXIMUM: 'exclusiveMaximum',
  EXCLUSIVE_MINIMUM: 'exclusiveMinimum',
  FORMAT: 'format',
  IN: 'in',
  INFO: 'info',
  ITEMS: 'items',
  MAXIMUM: 'maximum',
  MAX_LENGTH: 'maxLength',
  MINIMUM: 'minimum',
  MIN_LENGTH: 'minLength',
  MULTIPLE_OF: 'multipleOf',
  NAME: 'name',
  OPERATION_ID: 'operationId',
  PARAMETERS: 'parameters',
  PATHS: 'paths',
  PROPERTIES: 'properties',
  REF: '$ref',
  REQUEST_BODY: 'requestBody',
  REQUIRED: 'required',
  RESPONSES: 'responses',
  SCHEMA: 'schema',
  SCHEMAS: 'schemas',
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

const MEDIA_TYPE = {
  APPLICATION_JSON: 'application/json'
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#data-types
const OAS_DEFINED_TYPE = {
  INTEGER: 'integer'
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameter-object
const PARAMETER_LOCATION = {
  QUERY: 'query',
  HEADER: 'header',
  PATH: 'path',
  COOKIE: 'cookie'
}

// https://datatracker.ietf.org/doc/html/draft-bhutton-json-schema-00#section-4.2.1
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
