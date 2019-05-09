const v = require('node-input-validator');

const check = (params, objs) => {
    return new v(params, objs);
}


module.exports = {
    check
}