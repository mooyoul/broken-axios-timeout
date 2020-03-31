'use strict';

const debug = require('debug');
const http = require('http');

const log = debug('server');
log.enabled = true;

const PORT = parseInt(process.env.PORT, 10) || 8080;
const CHUNK_SEND_INTERVAL = 400; // 400ms

const server = http.createServer((req, res) => {
  log('got request');

  // for debugging
  const receivedAt = process.hrtime();
  res.socket.once('close', () => {
    const [ seconds, nanoseconds ] = process.hrtime(receivedAt);
    const elapsed = (seconds * 1e9 + nanoseconds) / 1e6;
    log('socket closed. took %dms to respond', elapsed);
  });

  const body = 'Hello World';
  const chunks = body.split('');

  // write response head immediately
  res.writeHead(200, 'OK', {
    'Content-Type': 'text/plain; charset=UTF-8',
    'Content-Length': body.length.toString(),
  });
  log('wrote response head');

  // and then, send each chunk by delaying specified interval
  send();

  function send() {
    const chunk = chunks.shift();
    if (chunk) {
      res.write(chunk, (e) => {
        if (e) {
          log('failed to write chunk: ', e.stack);
          return;
        }

        log('wrote %s', chunk);
        setTimeout(send, CHUNK_SEND_INTERVAL);
      });
    } else {
      res.end();
    }
  }
});

server.listen(PORT, () => {
  const { address, port } = server.address();

  log('server is listening at %s:%s', address, port);
});

