const assert = require('node:assert').strict
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const ts = require('typescript')
const {
  readAndGenerateSchema
} = require('../../..')

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })

test('generate from json', async (t) => {
  const equal = async (t, target) =>
    await t.test(target, () => assert.equal(
      printer.printFile(readAndGenerateSchema(path.join('test/v3.0/fixtures/json', `${target}.json`))),
      fs.readFileSync(path.join(__dirname, '../fixtures/schema', `${target}.ts`), 'utf8')
    ))

  const throws = async (t, target) =>
    await t.test(target, () => assert.throws(
      () => readAndGenerateSchema(path.join('test/v3.0/fixtures/json', `${target}.json`))
    ))

  /**
   * Examples in OAI/OpenAPI-Specification repository
   */
  // https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/api-with-examples.json
  await equal(t, 'api-with-examples')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/callback-example.json
  await throws(t, 'callback-example')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/link-example.json
  await equal(t, 'link-example')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/petstore-expanded.json
  await throws(t, 'petstore-expanded')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/petstore.json
  await equal(t, 'petstore')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/uspto.json
  await throws(t, 'uspto')

  /**
   * Examples in OpenAPI Specification
   */
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#info-object-example
  await equal(t, 'info-object-example')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#components-object-example
  await equal(t, 'components-object-example')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#paths-object-example
  await equal(t, 'paths-object-example')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#path-item-object
  await equal(t, 'path-item-object-example')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#operation-object-example
  await equal(t, 'operation-object-example')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#parameter-object-examples
  await equal(t, 'parameter-object-examples')

  /**
   * Custom fixtures
   */
  await equal(t, 'components-object-without-schemas')
  await throws(t, 'openapi-object-without-info-object')
  await throws(t, 'openapi-object-without-paths-object')
  await throws(t, 'operation-object-without-responses')
  await throws(t, 'reference-object-with-invalid-format')
  await throws(t, 'request-body-object-without-content')
  await equal(t, 'request-body-object-without-media-type-object')
  await equal(t, 'request-body-object-without-schema')
  await equal(t, 'response-object-without-content')
  await throws(t, 'response-object-without-description')
  await equal(t, 'schema-object-with-array')
  await equal(t, 'schema-object-with-empty-array')
  await equal(t, 'schema-object-without-properties')
})

test('generate from yaml', async (t) => {
  const equal = async (t, target) =>
    await t.test(target, () => assert.equal(
      printer.printFile(readAndGenerateSchema(path.join('test/v3.0/fixtures/yaml', `${target}.yaml`))),
      fs.readFileSync(path.join(__dirname, '../fixtures/schema', `${target}.ts`), 'utf8')
    ))

  const throws = async (t, target) =>
    await t.test(target, () => assert.throws(
      () => readAndGenerateSchema(path.join('test/v3.0/fixtures/yaml', `${target}.yaml`))
    ))

  /**
   * Examples in OAI/OpenAPI-Specification repository
   */
  // https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/api-with-examples.yaml
  await equal(t, 'api-with-examples')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/callback-example.yaml
  await throws(t, 'callback-example')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/link-example.yaml
  await equal(t, 'link-example')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/petstore-expanded.yaml
  await throws(t, 'petstore-expanded')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/petstore.yaml
  await equal(t, 'petstore')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/uspto.yaml
  await throws(t, 'uspto')
})

test('generate from yml', async (t) => {
  const equal = async (t, target) =>
    await t.test(target, () => assert.equal(
      printer.printFile(readAndGenerateSchema(path.join('test/v3.0/fixtures/yml', `${target}.yml`))),
      fs.readFileSync(path.join(__dirname, '../fixtures/schema', `${target}.ts`), 'utf8')
    ))

  /**
   * Third party tools
   */
  // https://github.com/nearform/openapi-transformer-toolkit/blob/master/test/fixtures/openapi.yml
  await equal(t, 'openapi-transformer-toolkit')
})

test('unknown file type', async (t) => {
  assert.throws(() => readAndGenerateSchema('test/v3.0/fixtures/bar/foo.bar'))
})
