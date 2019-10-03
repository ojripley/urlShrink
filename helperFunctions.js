const bcrypt = require('bcrypt');


//   /////////////////////////////////////////
//   // helper functions for server.js below
//   /////////////////////////////////////////



const generateRandomString = function(length) {
  let string = '';
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz1234567890';

  for (let i = 0; i < length; i++) {
    string += characters.charAt(Math.floor(Math.random() * characters.length));
  }

  return string;
};


const authenticate = function(reqBody, users) {

  console.log('\ntrying to sign in user:', reqBody.email);

  const user = fetchUserByEmail(reqBody.email, users);

  // hash submitted password and compare it with stored hash key of the user
  if (user) {
    if (bcrypt.compareSync(reqBody.password, user.password)) {
      return user;
    }
  }
  return undefined;
};


const fetchUserURLs = function(userID, urlDatabase) {
  
  const userURLs = {};

  for (let url in urlDatabase) {
    if (urlDatabase[url].userID === userID) {
      userURLs[url] = urlDatabase[url];
    }
  }
  return userURLs;
};


const fetchUserByEmail = function(email, users) {
   
  for (let user in users) {
    if (users[user].email === email) {
      return users[user];
    }
  }
  return null;
};

const isLoggedIn = function(res) {
  if (res.session.userID) {
    return true;
  } else {
    return false;
  }
};

module.exports = {
  generateRandomString,
  authenticate,
  fetchUserURLs,
  fetchUserByEmail,
  isLoggedIn
};