const { checkJWT } = require('../helpers/checkJWT')

const validateJWT = async (req, res, next) => {
    try {
        const token = await checkJWT(req, res);

        if(!token.status) {
            req.accountId = token.id
            res.accountId = token.id
        }

        next();          

    } catch (error) {
        return  {
            status: false,
            message: 'Token invalid'            
        };
    }    
}

module.exports = { validateJWT }