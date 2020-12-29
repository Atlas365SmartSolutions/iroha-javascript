/* eslint-disable no-console */

// for usage with grpc package use endpoint_grpc_pb file
import grpc from 'grpc'
import {
  QueryService_v1Client as QueryService,
  CommandService_v1Client as CommandService
} from '../lib/proto/endpoint_grpc_pb'

import commands from '../lib/commands'
import queries from '../lib/queries'

const IROHA_ADDRESS = 'localhost:50051'

const adminPriv =
  'f101537e319568c765b2cc89698325604991dca57b9716b58016b253506cab70'

const commandService = new CommandService(
  IROHA_ADDRESS,
  grpc.credentials.createInsecure()
)

const queryService = new QueryService(
  IROHA_ADDRESS,
  grpc.credentials.createInsecure()
)

queries.fetchCommits(
  {
    privateKey: adminPriv,
    creatorAccountId: 'admin@test',
    queryService,
    timeoutLimit: 5000
  },
  (block) => console.log('fetchCommits new block:', block),
  (error) => console.error('fetchCommits failed:', error.stack)
)

Promise.all([
  commands.addAssetQuantity({
    privateKeys: [adminPriv],
    creatorAccountId: 'admin@test',
    quorum: 1,
    commandService,
    timeoutLimit: 5000
  }, {
    assetId: 'coin#test',
    amount: '10'
  })
])
  .then(a => console.log(a))
  .catch(e => console.error(e))
