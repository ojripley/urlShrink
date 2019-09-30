const express = require('express');
const app = express();
const PORT = 8080;

app.set('view engine', 'ejs');

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
  // res.send('welcome to urls!\n');

  let templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});


// the colon in this address makes the following a VARIABLE. so 'shortURL' is not translated literally
app.get('/urls/:shortURL', (req, res) => {

  // req.params.shortURL refers to the variable in the address. :efjfjefojef becomes a paramater when the address is parsed
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render('urls_show', templateVars);
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
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