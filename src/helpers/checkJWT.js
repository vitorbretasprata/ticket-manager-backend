const jwt = require('jsonwebtoken');

const checkJWT = async (req) => {
    try {
        
        const token = (req.headers['authorization'] || req.headers['authorization-token'] || req.headers['x-access-token']).match(/^Bearer (.+)/);
        const valid = await jwt.verify(token[1], process.env.SECRET_KEY);
        return valid;        

    } catch (error) {
        return  {
            status: false,
            message: 'Token invalid'            
        };
    }    
}

module.exports = { checkJWT }