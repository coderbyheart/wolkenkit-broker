'use strict';

const pg = require('pg'),
      retry = require('retry');

const waitForPostgres = function (options, callback) {
  if (!options) {
    throw new Error('Options are missing.');
  }
  if (!options.url) {
    throw new Error('Url is missing.');
  }

  const { url } = options;

  const operation = retry.operation();

  operation.attempt(() => {
    pg.connect(url, (err, db, done) => {
      if (operation.retry(err)) {
        return;
      }

      if (err) {
        return callback(operation.mainError());
      }

      /* eslint-disable callback-return */
      done();
      callback(null);
      /* eslint-enable callback-return */
    });
  });
};

module.exports = waitForPostgres;
