const assert = require('node:assert').strict
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const ts = require('typescript')
const {
  generate
} = require('../../../lib/v3.1/schema/generate')

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })

test('generate from json', async (t) => {
  const equal = async (t, target) =>
    await t.test(target, () => assert.equal(
      printer.printFile(generate(path.join('test/v3.1/fixtures/json', `${target}.json`))),
      fs.readFileSync(path.join(__dirname, '../fixtures/schema', `${target}.ts`), 'utf8')
    ))

  const throws = async (t, target) =>
    await t.test(target, () => assert.throws(
      () => generate(path.join('test/v3.1/fixtures/json', `${target}.json`))
    ))

  /**
   * Examples in OAI/OpenAPI-Specification repository
   */
  // https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.1/non-oauth-scopes.json
  await equal(t, 'non-oauth-scopes')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.1/webhook-example.json
  await equal(t, 'webhook-example')

  /**
   * Examples in OpenAPI Specification
   */
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#info-object-example
  await equal(t, 'info-object-example')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#components-object-example
  await equal(t, 'components-object-example')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#paths-object-example
  await equal(t, 'paths-object-example')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#path-item-object
  await equal(t, 'path-item-object-example')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#operation-object-example
  await equal(t, 'operation-object-example')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#parameter-object-examples
  await equal(t, 'parameter-object-examples')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#request-body-examples
  await equal(t, 'request-body-example')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#responses-object-example
  await equal(t, 'responses-object-example')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#reference-object-example
  await equal(t, 'reference-object-example')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#primitive-sample
  await equal(t, 'schema-object-example-primitive-sample')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#simple-model
  await equal(t, 'schema-object-example-simple-model')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#model-with-mapdictionary-properties
  await equal(t, 'schema-object-example-model-with-map-dictionary-properties')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#model-with-example
  await equal(t, 'schema-object-example-model-with-example')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#models-with-composition
  await equal(t, 'schema-object-example-models-with-composition')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.1.0.md#models-with-polymorphism-support
  await equal(t, 'schema-object-example-models-with-polymorphism-support')

  /**
   * Custom fixtures
   */
  await equal(t, 'openapi-object-without-paths-object')
  await equal(t, 'parameter-object-without-required')
  await throws(t, 'reference-object-with-invalid-format')
  await throws(t, 'request-body-object-without-content')
})

test('generate from json', async (t) => {
  const equal = async (t, target) =>
    await t.test(target, () => assert.equal(
      printer.printFile(generate(path.join('test/v3.1/fixtures/yaml', `${target}.yaml`))),
      fs.readFileSync(path.join(__dirname, '../fixtures/schema', `${target}.ts`), 'utf8')
    ))

  /**
   * Examples in OAI/OpenAPI-Specification repository
   */
  // https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.1/non-oauth-scopes.json
  await equal(t, 'non-oauth-scopes')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.1/webhook-example.json
  await equal(t, 'webhook-example')
})

test('unknown file type', async (t) => {
  assert.throws(() => generate('test/v3.1/fixtures/bar/foo.bar'))
})
