const assert = require('node:assert').strict
const test = require('node:test')
const {
  parseReferenceObject,
  resolveRelativeSchemaDocument
} = require('../../lib/v3.0/parseReferenceObject')

test('parseReferenceObject', async (t) => {
  await t.test('resolveReferenceObject could not resolve', () => {
    assert.throws(() => parseReferenceObject('', {}, '#/components/schemas/Pet'))
  })
})

test('resolveRelativeSchemaDocument', async (t) => {
  await t.test('Unexpected file type', () => {
    assert.throws(() => resolveRelativeSchemaDocument('', 'Pet.txt'))
  })
})
