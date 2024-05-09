import app from './app';
import debug from 'debug';
debug('ts-express:server');

// Set port
type Port = string | number | false;
const port: Port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

function normalizePort(val: string): Port {
  const radix = 10;
  const port = parseInt(val, radix);

  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
}

import { logger } from '@utilities';
// Create server
import http = require('http');
const server = http.createServer(app);
server.listen(port, () => {
  logger.info(`Server is running on port ${port}`, 'Server');
});
server.on('error', onError);
server.on('listening', onListening);

function onError(error: any) {
  if (error.syscall !== 'listen') throw error;

  const bind = typeof port === 'string' ? 'Pipe ' + port : 'Port ' + port;
  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
    default:
      throw error;
  }
}

function onListening() {
  const addr = server.address();
  const bind = typeof addr === 'string' ? 'pipe ' + addr : 'port ' + addr!.port;
  debug('Listening on ' + bind);
}
