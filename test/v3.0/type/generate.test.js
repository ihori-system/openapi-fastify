const assert = require('node:assert').strict
const fs = require('node:fs')
const path = require('node:path')
const test = require('node:test')
const ts = require('typescript')
const {
  readAndGenerateType
} = require('../../..')

const printer = ts.createPrinter({ newLine: ts.NewLineKind.LineFeed })

test('generate from json', async (t) => {
  const equal = async (t, target) =>
    await t.test(target, () => assert.equal(
      printer.printFile(readAndGenerateType(path.join('test/v3.0/fixtures/json', `${target}.json`))),
      fs.readFileSync(path.join(__dirname, '../fixtures/type', `${target}.ts`), 'utf8')
    ))

  const throws = async (t, target) =>
    await t.test(target, () => assert.throws(
      () => readAndGenerateType(path.join('test/v3.0/fixtures/json', `${target}.json`))
    ))

  /**
   * Examples in OAI/OpenAPI-Specification repository
   */
  // https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/api-with-examples.json
  await equal(t, 'api-with-examples')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/link-example.json
  await equal(t, 'link-example')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.0/petstore.json
  await equal(t, 'petstore')

  /**
   * Examples in OpenAPI Specification
   */
  // https://github.com/OAI/OpenAPI-Specification/blob/main/versions/3.0.3.md#parameter-object-examples
  await equal(t, 'parameter-object-examples')

  /**
   * Custom fixtures
   */
  await throws(t, 'openapi-object-without-info-object')
  await throws(t, 'openapi-object-without-paths-object')
  await throws(t, 'operation-object-without-responses')
  await equal(t, 'response-object-without-content')
  await throws(t, 'response-object-without-description')
  await equal(t, 'schema-object-with-array')
  await equal(t, 'schema-object-with-empty-array')
  await equal(t, 'schema-object-without-properties')
})
