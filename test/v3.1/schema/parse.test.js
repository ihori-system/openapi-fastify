const assert = require('node:assert').strict
const test = require('node:test')
const {
  parsePathsObject
} = require('../../../lib/v3.1/schema/parse')

test('generate', async (t) => {
  await t.test('parsePathsObject', () => {
    assert.equal(parsePathsObject(), undefined)
  })
})
