
//
//
//
//                  YOU LEFT OFF AT 'USERS CAN ONLY SEE THEIR OWN SHORTENED URLS'
//
//
//

















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
  'b2xVn2': { longURL: 'http://www.lighthouselabs.ca', userID: 'ojr' },
  '9sm5xK': { longURL: 'http://www.google.com', userID: 'ojr' }
};

// urlDatabase[newKey].longURL = 'http://' + req.body.longURL;

const users = {
  "ojr": {
    id: "ojr",
    email: "o@m.com",
    password: "p"
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
  // if user is logged in, redirects to /urls
  res.redirect('/urls');
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



  if (!req.cookies.user_id) {
    console.log('login first!');
    res.redirect('/login');
  } else {
    console.log('letting you in!');
    res.render('urls_new', { user: users[req.cookies.user_id] });
  }
});


// the colon in this address makes the following a VARIABLE. so 'shortURL' is not translated literally
// this means that route definitions matter! urls/new must come before urls/:id because otherwise we will land on :new (which we don't want)
app.get('/urls/:shortURL', (req, res) => {
  // req.params.shortURL refers to the variable in the address. :efjfjefojef becomes a paramater when the address is parsed
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.cookies.user_id] };
  console.log(`rendering a page for the url ${templateVars.longURL}`);
  res.render('urls_show', templateVars);
});


app.get('/urls.json', (req, res) => {
  // responding with urlDatabase as a json string
  res.json(urlDatabase);
});


app.get('/u/:shortURL', (req, res) => {
  // redirects user to the longURL endpoint
  res.redirect(urlDatabase[req.params.shortURL].longURL);
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
  urlDatabase[newKey] = { longURL: 'http://' + req.body.longURL, userID: req.cookies.user_id };

  console.log(req.cookies.user_id);

  console.log(`new link object is ${urlDatabase[newKey].longURL} and ${urlDatabase[newKey].userID}`);

  res.redirect('/urls/' + newKey);
});


app.post('/urls/:shortURL', (req, res) => {
  urlDatabase[req.params.shortURL] = { longURL: 'http://' + req.body.longURL, userID: req.cookies.user_id };
  
  console.log(urlDatabase[req.params.shortURL].longURL + '  ' + urlDatabase[req.params.shortURL].userID);

  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.cookies.user_id] };

  res.render('urls_show', templateVars);
});


app.post('/urls/:shortURL/delete', (req, res) => {
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