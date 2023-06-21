import { test } from 'tap'
import { build } from '../../../helper'

test('GET /pets/:id', async (t) => {
  const app = await build(t)

  const res = await app.inject({
    url: '/pets/1'
  })

  t.equal(res.statusCode, 200)
  t.equal(res.payload, '{"id":1,"name":"John","tag":"Sports"}')
})

