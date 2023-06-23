import { test } from 'tap'
import { build } from '../../helper.js'

test('POST pets', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    method: 'POST',
    url: '/pets'
  })

  t.equal(res.statusCode, 201)
  t.equal(res.body, '')
})

test('GET /pets', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/pets'
  })

  t.equal(res.statusCode, 200)
  t.equal(res.payload, '[{"id":1,"name":"John"},{"id":2,"name":"Bob","tag":"Music"}]')
})
