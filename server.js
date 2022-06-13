'use strict';

require('dotenv').config();

const fs = require('fs');
const join = require('path').join;
const express = require('express');


const port = process.env.PORT || 3005;
const app = express();

/**
 * Expose
 */
module.exports = app;


listen();

function listen() {
  if (app.get('env') === 'test') return;
  app.listen(port);
  console.log('Vebank job listen event started on port ' + port);
}
