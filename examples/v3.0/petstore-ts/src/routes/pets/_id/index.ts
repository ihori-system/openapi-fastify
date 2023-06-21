import { FastifyPluginAsync } from "fastify"
// import {
//   showPetById
// } from '../../../generated/schemas'
import {
  showPetByIdReply200,
  showPetByIdReplyDefault
} from '../../../generated/interfaces'

const pet: FastifyPluginAsync = async (fastify, opts): Promise<void> => {
  fastify.route<{
    Reply: showPetByIdReply200 | showPetByIdReplyDefault
  }>({
    method: 'GET',
    url: '/',
    // schema: showPetById,
    handler: async function (request, reply) {
      return reply.send({
        id: 1,
        name: 'John',
        tag: 'Sports'
      })  
    }
  })
}

export default pet;
