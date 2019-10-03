//
//
//
//
//
//  URL shortener
//  Tiny App Assignment
//  Week 3 of Lighthouse Labs
//  Owen Ripley
//  September, 2019
//
//
//
//
//



// app/constants set up
const express = require('express');
const cookieParser = require('cookie-session');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');
const {
  generateRandomString,
  authenticate,
  fetchUserURLs,
  fetchUserByEmail,
  isLoggedIn
} = require('./helperFunctions');
const app = express();
const PORT = 8080;

// setup the view engine
app.set('view engine', 'ejs');

// body parser converts the request body from a Buffer into a string that can be read
app.use(bodyParser.urlencoded({extended: true}));

// cookie parser.. still not entirely sure what it is used for, since cookies seem to work without it
app.use(cookieParser({signed: false}));



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
    password: bcrypt.hashSync('p', 10)
  },
  // "user2RandomID": {
  //   id: "user2RandomID",
  //   email: "user2@example.com",
  //   password: "dishwasher-funk"
  // }
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
  if (!req.session.userID) {
    console.log('login first!');
    res.redirect('/login');
  } else {
    res.redirect('/urls');
  }
  
});


app.get('/urls', (req, res) => {


  if (!req.session.userID) {
    res.send('You need to login in first!');

    // setTimeout(function() {

    //   console.log('this is ' + res);

    //   res.redirect('/login');
    //   return;
    // }, 5000, res);

  } else {
    const userURLS = fetchUserURLs(req.session.userID, urlDatabase);

    // renders the urlDatabase in an easy to read table on the page /urls
    let templateVars = {
      user: users[req.session.userID],
      urls: userURLS
    };
    console.log("rendering urlDatabase on /urls");
    res.render('urls_index', templateVars);
  }
});


app.get('/urls/new', (req, res) => {

  if (!req.session.userID) {
    console.log('login first!');
    res.redirect('/login');
  } else {
    console.log('letting you in!');
    res.render('urls_new', { user: users[req.session.userID] });
  }
});


// the colon in this address makes the following a VARIABLE. so 'shortURL' is not translated literally
// this means that route definitions matter! urls/new must come before urls/:id because otherwise we will land on :new (which we don't want)
app.get('/urls/:shortURL', (req, res) => {

  if (!urlDatabase[req.params.shortURL]) {
    res.send('Sorry, that URL doesn\'t exist!');
  } else if (req.session.userID) {
    if (req.session.userID === urlDatabase[req.params.shortURL].userID) {
      // req.params.shortURL refers to the variable in the address. :efjfjefojef becomes a paramater when the address is parsed
      let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.session.userID] };
      console.log(`rendering a page for the url ${templateVars.longURL}`);
      res.render('urls_show', templateVars);
    } else {
      res.send('Sorry, your account does not have access to this URL.');
    }
  } else {
    res.send('Please login first!');
  }
});


app.get('/urls.json', (req, res) => {
  // responding with urlDatabase as a json string
  res.json(urlDatabase);
});


app.get('/u/:shortURL', (req, res) => {

  if (!urlDatabase[req.params.shortURL]) {
    res.send('Sorry, that URL doesn\'t exist!');
  } else {
    // redirects user to the longURL endpoint
    res.redirect(urlDatabase[req.params.shortURL].longURL);
  }
});


app.get('/login', (req, res) => {
  
  console.log(req.session.userID);

  if (req.session.userID) {
    res.redirect('/urls');
  } else {
    res.render('login');
  }
    
});


app.get('/register', (req, res) => {
  if (req.session.userID) {
    res.redirect('/urls');
  } else {
    res.render('register');
  }
});



// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------



//   /////////////////////////////
//   // post requests follow below
//   /////////////////////////////

app.post('/urls' , (req, res) => {

  if (!req.params.userID) {
    res.send('Please login first!');
  } else {
    const newKey = generateRandomString(6);
    console.log('accepting request to update urlDatabase with new longURL', req.body.longURL);
    urlDatabase[newKey] = { longURL: 'http://' + req.body.longURL, userID: req.session.userID };

    res.redirect('/urls/' + newKey);
  }
});


app.post('/urls/:shortURL', (req, res) => {
  
  if (req.session.userID) {
    if (req.session.userID === urlDatabase[req.params.shortURL].userID) {
      urlDatabase[req.params.shortURL] = { longURL: 'http://' + req.body.longURL, userID: req.session.userID };

      console.log('updaaaaate!   ' + urlDatabase[req.params.shortURL].longURL + '  ' + urlDatabase[req.params.shortURL].userID);

      const templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.session.userID] };
      res.render('urls_show', templateVars);
    } else {
      res.send('Sorry, you don\'nt have permission to edit this URL!');
    }
  } else {
    res.send('Please login first!');
  }
});


app.post('/urls/:shortURL/delete', (req, res) => {
  
  if (req.session.userID) {
    if (req.session.userID === urlDatabase[req.params.shortURL].userID) {
      console.log('a user was logged in when the request was made!');
      delete urlDatabase[req.params.shortURL];
      res.redirect('/urls');
    } else {
      res.send('Sorry, you don\'t have permission to edit this URL');
    }
  } else {
    res.send('Please login first!');
  }
});


app.post('/login', (req, res) => {
  
  const reqBody = req.body;
  const user = authenticate(reqBody, users);

  console.log('\n\nuser after authentication: ', user);

  if (user) {
    req.session.userID = user.id; // this is a session cookie set
    res.redirect('/urls');
    return;
  } else {
    res.status(403).send('user email or password incorrect!');
  }
});


app.post('/logout', (req, res) => {
  console.log('\nlogging out the user', req.session.userID);

  // delete session cookie by setting it to null
  req.session.userID = null;
  res.redirect('/login');
});


app.post('/register', (req, res) => {
  // registration handler

  if (!fetchUserByEmail(req.body.email, users)) {
    // if user email does not already exist
    if (req.body.password.length === 0 || req.body.email.length === 0) {
      
      res.send('Fields cannot be empty!');
      
    } else {
      // new user object
      const newUserID = generateRandomString(3);
      users[newUserID] = {
        id: newUserID,
        email: req.body.email,
        // pass word is stored as an hash key, with saltRounds: 10
        password: bcrypt.hashSync(req.body.password, 10)
      };

      // set userID cookie and redirect to users' urls
      req.session.userID = users[newUserID].id;
      res.redirect('/urls');
      
    }
  } else {
    res.send('An account with that email already exists!');
  }
});


// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------


