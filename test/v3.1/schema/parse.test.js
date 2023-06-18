const assert = require('node:assert').strict
const test = require('node:test')
const ts = require('typescript')
const {
  valueToLiteral
} = require('../../../lib/v3.1/schema/parse')

test('valueToLiteral', async (t) => {
  await t.test('null', () => {
    assert.deepEqual(valueToLiteral(null), ts.factory.createNull())
  })

  await t.test('true', () => {
    assert.deepEqual(valueToLiteral(true), ts.factory.createTrue())
  })

  await t.test('false', () => {
    assert.deepEqual(valueToLiteral(false), ts.factory.createFalse())
  })

  await t.test('number', () => {
    assert.deepEqual(valueToLiteral(1), ts.factory.createNumericLiteral(1))
  })

  await t.test('string', () => {
    assert.deepEqual(valueToLiteral('hello'), ts.factory.createStringLiteral('hello'))
  })

  await t.test('unexpected value', () => {
    assert.throws(() => valueToLiteral(Symbol('')))
  })
})
