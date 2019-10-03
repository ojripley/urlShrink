const { assert } = require('chai');

const { fetchUserByEmail } = require('../helperFunctions.js');

const testUsers = {
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

describe('fetchUserByEmail', function() {
  it('should return a user with valid email', function() {
    const user = fetchUserByEmail("user@example.com", testUsers);
    const expectedOutput = "userRandomID";
    
    assert(expectedOutput, user);
  });
  it('should return null if a user is not found', () => {
    const user = fetchUserByEmail("u@example.com", testUsers);
    
    console.log(user);

    assert.isNull(user);
  });
});