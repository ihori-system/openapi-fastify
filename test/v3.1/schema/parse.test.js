const assert = require('node:assert').strict
const test = require('node:test')
const {
  valueToLiteral
} = require('../../../lib/v3.1/schema/parse')

test('valueToLiteral', async (t) => {
  await t.test('unexpected value', () => {
    assert.throws(() => valueToLiteral(Symbol('')))
  })
})
