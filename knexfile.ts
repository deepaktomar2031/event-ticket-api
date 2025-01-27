import knex, { type Knex } from 'knex'

let client: Knex | undefined

const getConnectionConfig = ({ connectionString }: { connectionString: string | undefined }) => {
  const connection: Knex.PgConnectionConfig = {
    connectionString,
  }

  return connection
}

export const getClientConfig = () => ({
  client: 'pg',
  connection: getConnectionConfig({ connectionString: process.env.DATABASE_URL }),
  migrations: {
    directory: './migrations',
    extension: 'ts',
  },
})

export const connectToDatabase = () => {
  if (!client) {
    client = knex(getClientConfig())
  }
}

export const disconnectFromDatabase = async () => {
  if (client) {
    await client.destroy()
    client = undefined
  }
}

export const getClient = () => {
  if (!client) {
    throw new Error('Client is not defined')
  }

  return client
}

export default getClientConfig()
