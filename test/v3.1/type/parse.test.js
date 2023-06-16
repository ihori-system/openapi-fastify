const assert = require('node:assert').strict
const test = require('node:test')
const {
  parseComponentsObject,
  parsePathsObject
} = require('../../../lib/v3.1/type/parse')

test('parse', async (t) => {
  await t.test('parseComponentsObject', () => {
    assert.equal(parseComponentsObject(), undefined)
  })

  await t.test('parsePathsObject', () => {
    assert.equal(parsePathsObject(), undefined)
  })
})
