const assert = require('node:assert').strict
const test = require('node:test')
const ts = require('typescript')
const {
  toOASTypeNode,
  toPrimitiveNode,
  toTypeNode
} = require('../../../lib/v3.1/type/parse')

test('toOASTypeNode', async (t) => {
  await t.test('integer', () => {
    assert.deepEqual(toOASTypeNode('integer'), ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword))
  })

  await t.test('unexpected type', () => {
    assert.throws(() => toOASTypeNode('xxxxx'))
  })
})

test('toPrimitiveNode', async (t) => {
  await t.test('null', () => {
    assert.deepEqual(toPrimitiveNode('null'), ts.factory.createLiteralTypeNode(ts.factory.createNull()))
  })

  await t.test('boolean', () => {
    assert.deepEqual(toPrimitiveNode('boolean'), ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword))
  })

  await t.test('number', () => {
    assert.deepEqual(toPrimitiveNode('number'), ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword))
  })

  await t.test('string', () => {
    assert.deepEqual(toPrimitiveNode('string'), ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword))
  })

  await t.test('unexpected type', () => {
    assert.throws(() => toPrimitiveNode('xxxxx'))
  })
})

test('toTypeNode', async (t) => {
  await t.test('union type', () => {
    assert.deepEqual(toTypeNode('', {}, { type: ['string', 'integer'] }), ts.factory.createUnionTypeNode([ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword), ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword)]))
  })

  await t.test('unexpected union type', () => {
    assert.throws(() => toTypeNode('', {}, { type: ['xxxxx'] }))
  })

  await t.test('unexpected type', () => {
    assert.throws(() => toTypeNode('', {}, { type: 'xxxxx' }))
  })
})
