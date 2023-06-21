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
  await equal(t, 'api-with-examples')

  /**
   * Custom fixtures
   */
  await throws(t, 'openapi-object-without-info-object')
  await throws(t, 'openapi-object-without-paths-object')
  await throws(t, 'operation-object-without-responses')
  await equal(t, 'response-object-without-content')
  await throws(t, 'response-object-without-description')
})
