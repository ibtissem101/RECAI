const jwt = require('jsonwebtoken');

const authenticateJWT = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1]; // Assumes format: Bearer token
  if (!token) return res.status(403).send('Access denied');

  jwt.verify(token, 'secretkey', (err, user) => {
    if (err) return res.status(403).send('Access denied');
    req.user = user;
    next();
  });
};

module.exports = authenticateJWT;
