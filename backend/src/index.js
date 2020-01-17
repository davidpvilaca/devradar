const express = require('express');
const mongoose = require('mongoose');
const { config } = require('dotenv');
const cors = require('cors');
const http = require('http');
const routes = require('./routes');
const { setupWebSocket } = require('./websocket');

config();

const {
  MONGODB_USER: dbUser,
  MONGODB_PASS: dbPass,
  PORT
} = process.env;

const app = express();
const server = http.Server(app);

setupWebSocket(server);

mongoose.connect(`mongodb+srv://${dbUser}:${dbPass}@cluster0-lkvk4.mongodb.net/test?retryWrites=true&w=majority`, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(PORT || 3333);
