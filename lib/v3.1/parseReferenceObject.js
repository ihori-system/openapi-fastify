function resolveReferenceObject (
  inputPath,
  openapiObject,
  paths,
  currentObject
) {
  if (paths.length > 1) {
    return resolveReferenceObject(
      inputPath,
      openapiObject,
      paths,
      currentObject[paths.shift()]
    )
  }

  return currentObject[paths.shift()]
}

// https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#reference-object
function parseReferenceObject (
  inputPath,
  openapiObject,
  reference
) {
  if (typeof reference !== 'string') {
    // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#reference-object
    // > REQUIRED. The reference identifier. This MUST be in the form of a URI.
    throw new Error(`The reference identifier is must be in the form of a URI. Current value: ${reference}`)
  }

  return resolveReferenceObject(
    inputPath,
    openapiObject,
    reference.split('/').slice(1),
    openapiObject
  )
}

module.exports = {
  parseReferenceObject
}
