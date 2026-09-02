import { MongoClient, type Db, type Collection, ObjectId } from "mongodb"
import dns from "node:dns"

// Set public DNS resolvers to prevent ECONNREFUSED on SRV record queries on Windows local ISP DNS
try {
  dns.setServers(["8.8.8.8", "1.1.1.1"])
} catch {
  /* ignore fallback */
}

if (!process.env.MONGODB_URI) {
  throw new Error("Please add your MongoDB URI to environment variables")
}

const uri = process.env.MONGODB_URI
const options = {
  tls: true,
  tlsAllowInvalidCertificates: false,
  tlsAllowInvalidHostnames: false,
  serverSelectionTimeoutMS: 5000,
  connectTimeoutMS: 10000,
}

let client: MongoClient
let clientPromise: Promise<MongoClient>

declare global {
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

if (process.env.NODE_ENV === "development") {
  if (!global._mongoClientPromise) {
    client = new MongoClient(uri, options)
    global._mongoClientPromise = client.connect()
  }
  clientPromise = global._mongoClientPromise!
} else {
  client = new MongoClient(uri, options)
  clientPromise = client.connect()
}

export async function getDatabase(): Promise<Db> {
  const client = await clientPromise
  return client.db("sjmedialabs")
}

export async function getCollection<T extends Document>(name: string): Promise<Collection<T>> {
  const db = await getDatabase()
  return db.collection<T>(name)
}

export { clientPromise, ObjectId }
export default clientPromise
