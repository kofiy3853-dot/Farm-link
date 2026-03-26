import app from './app.js';
import http from 'http';
import { initSocket } from './socket/index.js';

const server = http.createServer(app);

// Initialize socket.io once, handlers are registered in initSocket
initSocket(server);

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});