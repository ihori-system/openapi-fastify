const FIELD_NAME = {
  DESCRIPTION: 'description',
  INFO: 'info',
  OPERATION_ID: 'operationId',
  PATHS: 'paths',
  RESPONSES: 'responses'
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
