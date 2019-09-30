// app set up
const express = require('express');
const app = express();
const PORT = 8080;

// view engine set up
app.set('view engine', 'ejs');

// body parser converts the request body from a Buffer into a string that can be read
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extend: true}));

// temporary(?) database set up
const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};

// ears open
app.listen(PORT, () => {
  console.log(`app is listening on port: ${PORT}`);
});

//   /////////////////////////////
//   // get requests follow below
//   // (route definition)
//   /////////////////////////////

// get request handlers
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

app.get('/urls/new', (req, res) => {

  res.render('urls_new');

  // if user is not logged in, redirects to /login
  res.redirect('/login');
});

// the colon in this address makes the following a VARIABLE. so 'shortURL' is not translated literally
// this means that route definitions matter! urls/new must come before urls/:id because otherwise we will land on :new (which we don't want)
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

app.get('urls/:shortURL/delete', (req, res) => {

});

app.get('/u/:shortURL', (req, res) => {
  // should redirect to the long url
  res.redirect(urlDatabase[req.params.shortURL]);
});

//   /////////////////////////////
//   // post requests follow below
//   /////////////////////////////

app.post('/urls' , (req, res) => {
  
  // body-parser is responsible for turning the body into an object for us to use
  const newKey = generateRandomString(6);
  urlDatabase[newKey] =  req.body.longURL;
  res.redirect('/urls/' + newKey);
});

app.post('/urls/:id', (req, res) => {

});

app.post('/urls/:id/delete', (req, res) => {

});

app.post('/login', (req, res) => {

});

app.post('/logout', (req, res) => {

});

const generateRandomString = function(length) {
  let string = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';

  for (let i = 0; i < length; i++) {
    string += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return string;
};