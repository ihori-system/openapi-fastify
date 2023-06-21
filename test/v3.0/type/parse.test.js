const assert = require('node:assert').strict
const test = require('node:test')
const ts = require('typescript')
const {
  toTypeNode
} = require('../../../lib/v3.0/type/parse')

test('toTypeNode', async (t) => {
  await t.test('string', () => {
    assert.deepEqual(toTypeNode('', {}, { type: 'string' }), ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword))
  })

  await t.test('unexpected type', () => {
    assert.throws(() => toTypeNode('', {}, { type: 'xxxxx' }))
  })
})
