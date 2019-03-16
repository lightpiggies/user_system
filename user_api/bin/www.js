'use strict';

const app = require('../src/app');

const port = process.env.PORT || 5001;
app.listen(port, () => {
  console.log('user_api starting using port:', port);
});
