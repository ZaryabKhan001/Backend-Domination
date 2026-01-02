import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT;

const httpServer = createServer(app);

//* initiate socket server

const io = new Server(httpServer);

app.use(express.static('public'));

//* io is main server instance, main hub
//* socket is single client connection

const users = new Set();

io.on('connection', (socket) => {
  console.log('connection', socket);

  // listening user joining from frontend
  socket.on('join', (userName) => {
    users.add(userName);
    socket.userName = userName;

    // broadcast to everyone that new user joined
    io.emit('userJoin', userName);

    // send updated user list
    io.emit('userList', users);
  });

  // handle incoming chat messages
  socket.on('chatMessage', (data) => {
    const { userName, message } = data;
    console.log(`New Message: ${message}, from ${userName}`);
    io.emit('newMessage', data);
  });

  // handle user leaving
  socket.on('disconnect', () => {
    console.log(`User leaves: ${socket.userName}`);

    users.forEach((userName) => {
      if (userName === socket.userName) {
        users.delete(userName);
        io.emit('userLeave', socket.userName);
        io.emit('userList', users);
      }
    });
  });
});

httpServer.listen(port, () => {
  console.log(`Http Server is listening on Port: ${port}`);
});
