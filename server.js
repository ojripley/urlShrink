// app set up
const express = require('express');
const app = express();
const PORT = 8080;

// view engine set up
app.set('view engine', 'ejs');

// body parser converts the request body from a Buffer into a string that can be read
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

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
});

app.get('/urls', (req, res) => {
  
  // renders the urlDatabase in an easy to read table on the page /urls
  let templateVars = { urls: urlDatabase };
  console.log("rendering urlDatabase on /urls");
  res.render('urls_index', templateVars);
});

app.get('/urls/new', (req, res) => {

  console.log('rendering create new url page on /urls/new');
  res.render('urls_new');
});

// the colon in this address makes the following a VARIABLE. so 'shortURL' is not translated literally
// this means that route definitions matter! urls/new must come before urls/:id because otherwise we will land on :new (which we don't want)
app.get('/urls/:shortURL', (req, res) => {

  // req.params.shortURL refers to the variable in the address. :efjfjefojef becomes a paramater when the address is parsed
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  console.log(`rendering a page for the url ${templateVars.longURL}`);
  res.render('urls_show', templateVars);
});

app.get('/urls.json', (req, res) => {
  // responding with urlDatabase as a json string
  res.json(urlDatabase);
});

app.get('/u/:shortURL', (req, res) => {
  // should redirect to the long url
  console.log('sending user to long url endpoint');
  res.redirect(urlDatabase[req.params.shortURL]);
});

//   /////////////////////////////
//   // post requests follow below
//   /////////////////////////////

app.post('/urls' , (req, res) => {
  
  // body-parser is responsible for turning the body into an object for us to use
  const newKey = generateRandomString(6);
  console.log('accepting request to update urlDatabase with new longURL', req.body.longURL);
  urlDatabase[newKey] =  'http://' + req.body.longURL;
  res.redirect('/urls/' + newKey);
});

app.post('/urls/:shortURL', (req, res) => {

  urlDatabase[req.params.shortURL] = 'http://' + req.body.longURL;
  console.log(`updating ${req.params.shortURL} to point to ${req.body.longURL}`);
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  res.render('urls_show', templateVars);
});

app.post('/urls/:shortURL/delete', (req, res) => {
  console.log(`deleting ${urlDatabase[req.params.shortURL]} and redirecting to /urls`);
  delete urlDatabase[req.params.shortURL];
  res.redirect('/urls');
});

const generateRandomString = function(length) {
  let string = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';

  console.log('generating key for new url pair');

  for (let i = 0; i < length; i++) {
    string += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return string;
};