const jwt = require('jsonwebtoken');
const serverError = require('../prototypes/handleError');

const generateToken = async (user) => {

    const payload = {
        id : user.id,
        name : user.Name,
        role: user.Role
    };

    let token = jwt.sign(payload, process.env.SECRET_KEY, { expiresIn: 432000 });

    if(!token) {
        throw new serverError("Auth", "Error on generating token", 500);
    }

    return token;
}

const checkJWT = async (req, res) => {
    try {
        
        var token = req.headers.authorization.split(' ')[1];
        const valid = await jwt.verify(token, process.env.SECRET_KEY);
        return valid;        

    } catch (error) {
        return  res.status(500).send({
            status: false,
            message: 'Token invalid'   
        });
    }    
}

module.exports = { generateToken, checkJWT }