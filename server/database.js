const { MongoClient, ServerApiVersion } = require('mongodb');

const client = new MongoClient(process.env.DATABASE_URI, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function getClientConnection() {
  await client.connect();
  return client;
}

module.exports = {
  getClientConnection,
}
