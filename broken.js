'use strict';

const axios = require('axios');
const debug = require('debug');

const log = debug('application');
log.enabled = true;

const PORT = parseInt(process.env.PORT) || 8080;
const TIMEOUT = 1000; // 1sec

(async () => {
  log('using axios version: %s', require('axios/package').version);

  log('requesting (configured timeout: %dms)', TIMEOUT);

  const requestedAt = process.hrtime();

  try {
    const res = await axios({
      method: 'GET',
      url: `http://127.0.0.1:${PORT}`,
      timeout: TIMEOUT,
    });

    log('got response: %d', res.status, res.headers);
    log(res.data);
    log('request configuration: ', res.config);
  } catch (e) {
    log('request failed: ', e.stack);
    if (e.response) {
      log('got response: ', e.response.status, e.response.headers);
      log(e.response.data);
    }
  }

  const [ seconds, nanoseconds ] = process.hrtime(requestedAt);
  const elapsed = (seconds * 1e9 + nanoseconds) / 1e6;
  log('took %dms', elapsed);
})().catch(log);
