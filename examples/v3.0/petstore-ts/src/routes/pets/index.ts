import { FastifyPluginAsync } from "fastify"
import {
  createPets,
  listPets
} from '../../generated/schemas'
import {
  createPetsReplyDefault,
  listPetsQuerystring,
  listPetsReply200,
  listPetsReplyDefault
} from '../../generated/interfaces'

const pets: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.route<{
    Reply: createPetsReplyDefault
  }>({
    method: 'POST',
    url: '/',
    schema: createPets,
    handler: async function (request, reply) {
      return reply.code(201).send()
    }
  })

  fastify.route<{
    Reply: listPetsReply200 | listPetsReplyDefault
    Querystring: listPetsQuerystring
  }>({
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

export default pets;
