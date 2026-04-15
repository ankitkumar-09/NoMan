import { MongoClient } from "mongodb"

let clientPromise: Promise<MongoClient> | undefined

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function getMongoClient() {
  const uri = process.env.MONGODB_URI
  if (!uri) {
    throw new Error("Please add MONGODB_URI to .env.local")
  }

  if (process.env.NODE_ENV === "development") {
    if (!global._mongoClientPromise) {
      const client = new MongoClient(uri)
      global._mongoClientPromise = client.connect()
    }
    return global._mongoClientPromise
  }

  if (!clientPromise) {
    const client = new MongoClient(uri)
    clientPromise = client.connect()
  }

  return clientPromise
}

export default getMongoClient
