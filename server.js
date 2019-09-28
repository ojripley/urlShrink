const express = require('express');
const app = express();
const port = 8080;

app.listen(port, () => {
  console.log('Listening on port 8080');
});

app.get('/', (request, response) => {
  response.send('welcome to shrink! enter a url to shorten');
});