
const jwt = require('jsonwebtoken');
module.exports= getTokenFromHeaders = (req) => {
    const { headers: { authorization } } = req;
  
    if(authorization && authorization.split(' ')[0] === 'Token') {
      return jwt.decode(authorization.split(' ')[1]);
    }
    return null;
  };