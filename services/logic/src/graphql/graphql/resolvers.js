import uuid from 'uuid'
import pubsub from '../../pubsub'

import { log, print } from 'io.maana.shared'

import { rawRequest } from 'graphql-request'

require('dotenv').config()

const SELF = `${process.env.SERVICE_ID}-graphql`

// const endpoint = 'https://api.graph.cool/simple/v1/cixos23120m0n0173veiiwrjr'

// const query = /* GraphQL */ `
//   {
//     Movie(title: "Inception") {
//       releaseDate
//       actors {
//         name
//       }
//     }
//   }

const request = async (endpoint, query, variables) => {
  const results = await rawRequest(endpoint, query, variables)
  const { data, errors, extensions, headers, status } = results
  console.log(
    JSON.stringify({ data, errors, extensions, headers, status }, undefined, 2)
  )
  return results
}

export const resolver = {
  Query: {
    query: async (_, { endpoint, query, variables }) => {
      const result = await request(endpoint, query, variables)
      pubsub.publish('onQuery', { onQuery: { endpoint, query, variables } })
      return result
    }
  },
  Mutation: {
    mutate: async (_, { endpoint, mutation, variables }) => {
      const result = await request(endpoint, mutation, variables)
      pubsub.publish('onMutate', {
        onMutate: { endpoint, mutation, variables }
      })
      return result
    }
  },
  Subscription: {
    onQuery: {
      subscribe: () => pubsub.asyncIterator('onQuery')
    },
    onMutate: {
      subscribe: () => pubsub.asyncIterator('onMutate')
    }
  }
}
