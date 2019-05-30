const pager = require("../helpers/pager")

const resquestAll = async (Schema, limit, page) => {
    try {
        const request = await pager(Schema, {}, limit, page);
        return request;
    } catch (error) {
        return error;
    }    
}

const resquest = async (Schema, query, limit, page) => {
    try {
        const request = await pager(Schema, query, limit, page);
        return request;
    } catch (error) {
        return error;
    }    
}

const resquestAll = async (Schema, limit, page) => {
    try {
        const request = await pager(Schema, limit, page);
        return request;
    } catch (error) {
        return error;
    }    
}

const setValidationEngine = async (obj) => {
    schema.prototype.isValid = isValid
}