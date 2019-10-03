//
//
//
//
//
//  URL shortener
//  Tiny App Assignment
//  Week 3 of Lighthouse Labs
//  Owen Ripley
//  Created September 30, 2019
//  Last updated October 3, 2019
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
const methodOverride = require('method-override');
const {
  generateRandomString,
  authenticate,
  fetchUserURLs,
  fetchUserByEmail,
} = require('./helperFunctions');
const app = express();
const PORT = 8080;

// setup the view engine
app.set('view engine', 'ejs');

// body parser converts the request body from a Buffer into a string that can be read
app.use(bodyParser.urlencoded({extended: true}));

// cookie parser.. still not entirely sure what it is used for, since cookies seem to work without it
app.use(cookieParser({signed: false}));

// method-override allows use of PUT and DELETE.
// the browser still makes only GET and POST requests, but the server can now be written as if it were recieving PUT and DELETE
app.use(methodOverride('_method'));



// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------



// temporary database set up (stored in objects for now instead of a real database)
// this means that the database will reset to default whenever the server is shut down
const urlDatabase = {
  'b2xVn2': {
    shortURL: 'b2xVn2',
    longURL: 'http://www.lighthouselabs.ca',
    userID: 'ojr',
    visits: []
  },
  '9sm5xK': {
    shortURL: '9sm5xK',
    longURL: 'http://www.google.com',
    userID: 'ojr',
    visits: []
  }
};

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
    res.status(401);
    res.send('You need to login in first!');
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
    
    res.status(401);
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
    res.status(404);
    res.send('Sorry, that URL doesn\'t exist!');
  } else if (req.session.userID) {
    if (req.session.userID === urlDatabase[req.params.shortURL].userID) {

      // req.params.shortURL refers to the variable in the address. :efjfjefojef becomes a paramater when the address is parsed
      let templateVars = { url: urlDatabase[req.params.shortURL], user: users[req.session.userID] };
      console.log(`rendering a page for the url ${templateVars.longURL}`);
      res.render('urls_show', templateVars);
    } else {
      res.status(403);
      res.send('Sorry, your account does not have access to this URL.');
    }
  } else {
    res.status(401);
    res.send('Please login first!');
  }
});


app.get('/u/:shortURL', (req, res) => {

  if (!urlDatabase[req.params.shortURL]) {
    res.status(404);
    res.send('Sorry, that URL doesn\'t exist!');
  } else {

    // redirects user to the longURL endpoint
    res.redirect(urlDatabase[req.params.shortURL].longURL);
    
    // update analytic stats
    urlDatabase[req.params.shortURL].visits.push({ visitID: generateRandomString(4), time: new Date(), visitedBy: req.session.userID});
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

  console.log(req.params);

  if (!req.session.userID) {
    res.status(401);
    res.send('Please login first!');
  } else {
    const newKey = generateRandomString(6);
   
    console.log('accepting request to update urlDatabase with new longURL', req.body.longURL);
   
    urlDatabase[newKey] = { shortURL: newKey, longURL: 'http://' + req.body.longURL, userID: req.session.userID, visits: [] };

    res.redirect('/urls/' + newKey);
  }
});


app.put('/urls/:shortURL', (req, res) => {
  
  if (req.session.userID) {
    if (req.session.userID === urlDatabase[req.params.shortURL].userID) {
      // overwrite long url
      urlDatabase[req.params.shortURL].longURL = 'http://' + req.body.longURL;
      // reset analytic stats
      urlDatabase[req.params.shortURL].visits = [];

      console.log('updaaaaate!   ' + urlDatabase[req.params.shortURL].longURL + '  ' + urlDatabase[req.params.shortURL].userID);

      const templateVars = { url: urlDatabase[req.params.shortURL], user: users[req.session.userID] };
      res.render('urls_show', templateVars);
    } else {
      res.status(403);
      res.send('Sorry, you don\'nt have permission to edit this URL!');
    }
  } else {
    res.status(401);
    res.send('Please login first!');
  }
});


app.delete('/urls/:shortURL/delete', (req, res) => {
  
  if (req.session.userID) {
    if (req.session.userID === urlDatabase[req.params.shortURL].userID) {
      console.log('a user was logged in when the request was made!');
    
      delete urlDatabase[req.params.shortURL];
      res.redirect('/urls');
    } else {
      res.status(403);
      res.send('Sorry, you don\'t have permission to edit this URL');
    }
  } else {
    res.status(401);
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

  if (!fetchUserByEmail(req.body.email, users)) {
    // if user email does not already exist
    if (req.body.password.length === 0 || req.body.email.length === 0) {
      res.status(403);
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
    res.status(403);
    res.send('An account with that email already exists!');
  }
});


// ------------------------------------------------------------------------------------------------------------------------------------------------------------
// ------------------------------------------------------------------------------------------------------------------------------------------------------------