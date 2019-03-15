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

const request = async (endpoint, query) => {
  const results = await rawRequest(endpoint, query)
  const { data, errors, extensions, headers, status } = results
  console.log(
    JSON.stringify({ data, errors, extensions, headers, status }, undefined, 2)
  )
  return results
}

export const resolver = {
  Query: {
    query: async (_, { endpoint, query }) => {
      const result = await request(endpoint, query)
      // pubsub.publish('onQuery', { onQuery: { endpoint, query } })
      return result
    }
  },
  Mutation: {
    mutate: async (_, { endpoint, mutation }) => {
      const result = await request(endpoint, mutation)
      // pubsub.publish('onMutate', { onMutate: { endpoint, mutation } })
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
