import {
  showPetById
} from '../../../generated/schemas.js'

export default async function (fastify, opts) {
  fastify.route({
    method: 'GET',
    url: '/',
    schema: showPetById,
    handler: async function (request, reply) {
      return reply.send({
        id: Number(request.params.petId),
        name: 'John',
        tag: 'Sports'
      })
    }
  })
}
