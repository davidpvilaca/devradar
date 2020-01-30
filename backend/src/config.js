const mongoose = require('mongoose')
const { config } = require('dotenv')

config()

const {
  MONGODB_USER: dbUser,
  MONGODB_PASS: dbPass,
  PORT,
  NODE_ENV
} = process.env

const isTesting = NODE_ENV === 'test'
const dbName = isTesting ? 'test' : 'devradar'

const connectDb = () => {
  mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0-lkvk4.mongodb.net/${dbName}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
  })
}

module.exports = {
  connectDb,
  PORT: isTesting ? parseInt(`${Math.random() * 10}999`, 10) : PORT,
  NODE_ENV
}
