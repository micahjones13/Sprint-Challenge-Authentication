const axios = require('axios');
const bcrypt = require('bcryptjs');
const Users = require('./users-model.js');
const secrets = require('../config/secrets.js');
const jwt = require('jsonwebtoken');

const { authenticate } = require('../auth/authenticate');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  // server.get('/api/', findUser); 
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
  let user = req.body;
  const hash = bcrypt.hashSync(user.password, 10);
  user.password = hash;
  
  Users.add(user)
  .then(saved => {
    res.status(201).json(saved);
  })
  .catch(err => {
    res.status(500).json({ message: 'Could not register' });
  })
}

function login(req, res) {
  // implement user login
  let { username, password } = req.body;
  console.log(username);
  
  Users.findBy({ username })
  .first()
  .then(user => {
    if (user && bcrypt.compareSync(password, user.password)) {
      console.log('inside if');
      console.log(password);
      console.log(user.password);
      const token = generateToken(user);
      console.log(token);
      res.json({ message: "Login Succesful", token: token });
    } else {
      res.satus(401).json({ message: "wrong username or password" });
    }
  })
  .catch(err => {
    res.status(500).json(err);
    
  })

}


function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}

// function findUser(req, res) {
//   const { username } = req.body;
//   Users.findBy(username)
//   .then(user => {
//     res.json(user);
//   })
//   .catch(err => {
//     res.status(500).json(err);
//   })
// }


function generateToken(user) {
  console.log('hit');
  const jwtPayload = {
    subject: user.id,
    username: user.username,
  };

  
  const jwtOptions = {
    expiresIn: '1d' //1 day 
  }
  return jwt.sign(jwtPayload, secrets.jwtSecret, jwtOptions)
}
