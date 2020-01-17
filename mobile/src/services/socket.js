import socketio from 'socket.io-client';

const socket = socketio('http://10.0.0.100:3333', {
  autoConnect: false,
});

function subscribeToNewDev(subscribeFn) {
  socket.on('new-dev', subscribeFn);
}

function connect(params) {
  socket.io.opts.query = params;
  socket.connect();

  socket.on('message', text => {
    console.log(text);
  });
}

function disconnect() {
  if (socket.disconnected) {
    socket.disconnect();
  }
}

export {
  connect,
  disconnect,
  subscribeToNewDev
};
