const validatePrivileges = async (req, res, next) => {    

    if(req.roles && req.roles == 'admin') {
        next();
    } else {
        return {
            status: false,
            Message: 'Insufficient privileges.'
        }
    }     
}

module.exports = { validatePrivileges }