import mongoose from "mongoose"

declare global {
  // eslint-disable-next-line no-var
  var mongoose: { conn: any, promise: any } | undefined;
}

const MONGODB_URI = process.env.MONGODB_URI!

if (!MONGODB_URI) throw new Error("Please add MONGODB_URI to .env.local")

let cached = global.mongoose || { conn: null, promise: null }

export async function connectDB() {
  if (cached.conn) return cached.conn
  if (!cached.promise) {
    cached.promise = mongoose.connect(MONGODB_URI, {
      dbName: "assignment1",
      bufferCommands: false,
    })
  }
  cached.conn = await cached.promise
  return cached.conn
}

