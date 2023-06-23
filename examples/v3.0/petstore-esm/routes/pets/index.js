import {
  createPets,
  listPets
} from '../../generated/schemas.js'

export default async function (fastify, opts) {
  fastify.route({
    method: 'POST',
    url: '/',
    schema: createPets,
    handler: async function (request, reply) {
      return reply.code(201).send()
    }
  })

  fastify.route({
    method: 'GET',
    url: '/',
    schema: listPets,
    handler: async function (request, reply) {
      return reply.send([
        {
          id: 1,
          name: 'John'
        },
        {
          id: 2,
          name: 'Bob',
          tag: 'Music'
        }
      ])
    }
  })
}
