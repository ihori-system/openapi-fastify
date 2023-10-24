const assert = require('node:assert').strict
const test = require('node:test')
const ts = require('typescript')
const {
  toOASTypeNode,
  toPrimitiveTypeNode,
  toTypeNode
} = require('../../../lib/v3.0/type/parse')

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
    assert.throws(() => toPrimitiveTypeNode('null'))
  })

  await t.test('boolean', () => {
    assert.deepEqual(toPrimitiveTypeNode('boolean'), ts.factory.createKeywordTypeNode(ts.SyntaxKind.BooleanKeyword))
  })

  await t.test('number', () => {
    assert.deepEqual(toPrimitiveTypeNode('number'), ts.factory.createKeywordTypeNode(ts.SyntaxKind.NumberKeyword))
  })

  await t.test('string', () => {
    assert.deepEqual(toPrimitiveTypeNode('string'), ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword))
  })

  await t.test('unexpected type', () => {
    assert.throws(() => toPrimitiveTypeNode('xxxxx'))
  })
})

test('toTypeNode', async (t) => {
  await t.test('string', () => {
    assert.deepEqual(toTypeNode('', {}, { type: 'string' }), ts.factory.createKeywordTypeNode(ts.SyntaxKind.StringKeyword))
  })

  await t.test('unexpected type', () => {
    assert.throws(() => toTypeNode('', {}, { type: 'xxxxx' }))
  })
})
