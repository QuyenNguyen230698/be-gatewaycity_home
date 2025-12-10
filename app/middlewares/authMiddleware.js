const jwt = require('jsonwebtoken');
const { ACCESS_TOKEN_SECRET } = require('../common/constant/app.constant');

exports.authenticateJWT = (req, res, next) => {
  const authHeader = req.header('Authorization');
  if (!authHeader) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  const token = authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ message: 'Access token missing' });
  }

  try {
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    req.user = decoded;
    next(); // Move to the next middleware without fetching user from DB
  } catch (error) {
    return res.status(403).json({ message: 'Invalid access token' });
  }
};
