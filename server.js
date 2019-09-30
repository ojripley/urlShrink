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

app.get('/', (req, res) => {

  // if user is logged in, redirects to /urls
  res.redirect('/urls');

  // if user is not logged in, redirects to /login
  res.redirect('/login');
});

app.get('/urls', (req, res) => {
  res.send('welcome to urls!\n');
});

app.get('urls.json', (req, res) => {

});

app.get('/login', (req, res) => {

});

app.get('/register', (req, res) => {

});

app.get('/urls/new', (req, res) => {

  // if user is not logged in, redirects to /login
  res.redirect('/login');
});

app.get('/urls/:id' , (req, res) => {

});

app.get('urls/:id/delete', (req, res) => {

});

app.get('/u/:id', (req, res) => {

});

app.post('/urls' , (req, res) => {

});

app.post('/urls/:id', (req, res) => {

});

app.post('/urls/:id/delete', (req, res) => {

});

app.post('/login', (req, res) => {

});

app.post('/logout', (req, res) => {

});