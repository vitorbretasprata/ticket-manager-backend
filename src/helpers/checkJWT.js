const jwt = require('jsonwebtoken');
const serverError = require('../prototypes/handleError');

const generateToken = async (user) => {

    const payload = {
        id : user._id,
        name : user.Name,
        role: user.Role
    };

    let token = jwt.sign({ payload }, config.secret, { expiresIn: 432000 });

    if(!token) {
        throw new serverError("Auth", "Error on generating token", 500);
    }

    return token;
}

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

module.exports = { generateToken, checkJWT }