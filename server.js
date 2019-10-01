// app/constants set up
const express = require('express');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const app = express();
const PORT = 8080;

// setup the view engine
app.set('view engine', 'ejs');

// body parser converts the request body from a Buffer into a string that can be read
app.use(bodyParser.urlencoded({extended: true}));

// cookie parser.. still not entirely sure what it is used for, since cookies seem to work without it
app.use(cookieParser());



// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------



// temporary database set up (stored in objects for now instead of a real database)
const urlDatabase = {
  'b2xVn2': 'http://www.lighthouselabs.ca',
  '9sm5xK': 'http://www.google.com'
};


const users = {
  "userRandomID": {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur"
  },
  "user2RandomID": {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk"
  }
};



// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------



// listen function
app.listen(PORT, () => {
  console.log(`app is listening on port: ${PORT}`);
});



// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------



//   /////////////////////////////
//   // get requests follow below
//   // (route definition)
//   /////////////////////////////

// get request handlers
app.get('/', (req, res) => {
  if (req.cookies.user_id) {
    // if user is logged in, redirects to /urls
    res.redirect('/urls');
  } else {
    res.redirect('/login');
  }
});


app.get('/urls', (req, res) => {
  // renders the urlDatabase in an easy to read table on the page /urls
  let templateVars = {
    user: users[req.cookies.user_id],
    urls: urlDatabase
  };
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
  // redirects user to the longURL endpoint
  res.redirect(urlDatabase[req.params.shortURL]);
});


app.get('/login', (req, res) => {
  res.render('login');
});


app.get('/register', (req, res) => {
  res.render('register');
});



// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------



//   /////////////////////////////
//   // post requests follow below
//   /////////////////////////////

app.post('/urls' , (req, res) => {
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


app.post('/login', (req, res) => {
  for (let user in users) {
    console.log(`user ${users[user].email}   from form ${req.body.email}`);
    if (users[user].email === req.body.email) {
      if (users[user].password === req.body.password) {
        res.cookie('user_id', users[user].id);
        res.redirect('/urls');
        return;
      }
    }
  }
  res.status(403).send('user email or password incorrect!');
});


app.post('/logout', (req, res) => {
  console.log('time to logout the user', req.cookies.user_id);

  // delete cookie
  res.clearCookie('user_id');
  res.redirect('/urls');
});


app.post('/register', (req, res) => {
  // registration handler

  const newUserID = generateRandomString(3);

  // new user object
  users[newUserID] = {
    id: newUserID,
    email: req.body.email,
    password: req.body.password
  };

  // set user_id cookie and redirect to users' urls
  res.cookie('user_id', users[newUserID].id);
  res.redirect('/urls');
});



// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------

//   /////////////////////////////
//   // external functions below
//   /////////////////////////////

const generateRandomString = function(length) {
  let string = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';

  for (let i = 0; i < length; i++) {
    string += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return string;
};