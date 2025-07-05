const { MongoClient, ServerApiVersion } = require('mongodb');
require("dotenv").config({path: "./.env"})

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(process.env.ATLAS_URL, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let database

module.exports = {
  // In module.exports: have functions or modules ONLY
  connectToServer: () => {
    database = client.db("Medicare")
  },
  getDB : () => {
    return database
  }
}