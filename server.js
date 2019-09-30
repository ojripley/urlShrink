const express = require('express');
const app = express();
const PORT = 8080;

const urlDatabase = {
  'b2xVn2': 'http:/www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

app.listen(PORT, () => {
  console.log(`app is listening on port: ${PORT}`);
});

app.get('/', (request, response) => {

  // if user is logged in, redirects to /urls
  response.redirect('/urls');

  // if user is not logged in, redirects to /login
  response.redirect('/login');
});

app.get('/urls', (request, response) => {
  response.send('welcome to urls!\n');
});

app.get('/login', (request, response) => {

});

app.get('/register', (request, response) => {

});

app.get('/urls/new', (request, response) => {

  // if user is not logged in, redirects to /login
  response.redirect('/login');
});

app.get('/urls/:id' , (request, response) => {

});

app.get('urls/:id/delete', (request, response) => {

});

app.get('/u/:id', (request, response) => {

});

app.post('/urls' , (request, response) => {

});

app.post('/urls/:id', (request, response) => {

});

app.post('/urls/:id/delete', (request, response) => {

});

app.post('/login', (request, response) => {

});

app.post('/logout', (request, response) => {

});