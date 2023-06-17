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

  /**
   * Examples in OAI/OpenAPI-Specification repository
   */
  // https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.1/non-oauth-scopes.json
  await equal(t, 'non-oauth-scopes')
  // https://github.com/OAI/OpenAPI-Specification/blob/main/examples/v3.1/webhook-example.json
  await equal(t, 'webhook-example')

  /**
   * Custom fixtures
   */
  await equal(t, 'openapi-object-without-paths-object')
})
