const assert = require('node:assert').strict
const test = require('node:test')
const {
  generate
} = require('../../../lib/v3.1/schema/generate')

test('generate', async (t) => {
  await t.test('', () => {
    assert.equal(generate(), undefined)
  })
})
