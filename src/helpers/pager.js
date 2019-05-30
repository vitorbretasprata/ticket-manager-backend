const pager = async (Schema, query, limit, page) => {
    
    if (!Schema.isValid){
        throw {
            Status: 422,
            Message: "Schema is not valid"
        }
    }

    const request = await Schema.find(query);

    return request;
}

module.export = pager;