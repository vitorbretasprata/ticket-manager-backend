const v = require('node-input-validator');

const valid = (params, objs) => {
    return new v(params, objs);
}

const contextValidation = async (res, context, constraints, message) => {
    try {
        const validator = valid(context, constraints);

        if (!(await validator.check())) {
            return "Error"
        }

        let newContext = {}


        for (key in constraints) {
            
            if (key.indexOf('.') > 0) {
                key = key.substr(0, key.indexOf('.'));
            } 

            if (key in newContext) {
                continue;
            } 

            newContext[key] = context[key]
        }

        return newContext
    }
    catch (error) {
        return error;
    }
}


module.exports = {
    valid,
    contextValidation
}