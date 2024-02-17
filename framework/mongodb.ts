// utils/mongodb.ts
import { MongoClient, Db } from 'mongodb';

const uri: string = process.env.MONGODB_URI!;
const dbName: string = process.env.MONGODB_DB!;

let cachedClient: MongoClient | null = null;
let cachedDb: Db | null = null;

interface ConnectType {
  client: MongoClient;
  db: Db;
}

export async function connectToDatabase(): Promise<ConnectType> {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client: MongoClient = await MongoClient.connect(uri);
  const db: Db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
