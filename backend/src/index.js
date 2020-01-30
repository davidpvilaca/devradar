const express = require('express')
const cors = require('cors')
const http = require('http')
const routes = require('./routes')
const { setupWebSocket } = require('./websocket')
const { connectDb, PORT } = require('./config')

connectDb()

const app = express()
const server = http.Server(app)

setupWebSocket(server)

app.use(cors())
app.use(express.json())
app.use(routes)

server.listen(PORT || 3333, () => console.log(`The application started on port ${PORT || 3333}`))

module.exports = {
  app,
  server
}
