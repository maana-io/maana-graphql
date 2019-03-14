require('dotenv').config()

import uuid from 'uuid'
import pubsub from '../../pubsub'

import { log, print } from 'io.maana.shared'

import { rawRequest } from 'graphql-request'

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

const query = async (endpoint, query) => {
  const { data, errors, extensions, headers, status } = await rawRequest(
    endpoint,
    query
  )
  console.log(
    JSON.stringify({ data, errors, extensions, headers, status }, undefined, 2)
  )
}

const mutate = async (endpoint, mutation) => {
  const { data, errors, extensions, headers, status } = await rawRequest(
    endpoint,
    mutation
  )
  console.log(
    JSON.stringify({ data, errors, extensions, headers, status }, undefined, 2)
  )
}

export const resolver = {
  Query: {
    query: async (_, { endpoint, query }) => {
      const result = await query(endpoint, query)
      // pubsub.publish('onQuery', { onQuery: { endpoint, query } })
      return result
    }
  },
  Mutation: {
    mutate: async (_, { endpoint, mutation }) => {
      const result = await mutate(endpoint, mutation)
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
