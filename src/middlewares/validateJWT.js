const { checkJWT } = require('../helpers/checkJWT')

const validateJWT = async (req, res, next) => {
    try {
        const token = await checkJWT(req);

        if(!token.status == false) {
            throw new Error("Token Invalid");
        }

        req.accountId = token.id;
        req.name = token.name;
        res.accountId = token.id;
        res.role = token.role;

        return next();          

    } catch (error) {
        return  {
            status: false,
            message: error.message            
        };
    }    
}

module.exports = { validateJWT }