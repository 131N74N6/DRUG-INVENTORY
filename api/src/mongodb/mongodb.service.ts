import { MongoClient } from "mongodb";

const uri = import.meta.env.MONGODB_URI!;
const dbName = import.meta.env.MONGODB_DB_NAME!;

export const mongoDbClient = new MongoClient(uri);

try {
    await mongoDbClient.connect();
    console.log("✅ database connection successfully");
} catch (error) {
    console.error("❎ database connection failed:", error);
    process.exit(1);
}

const connection = mongoDbClient.db(dbName);

export function db() {
    return connection;
}