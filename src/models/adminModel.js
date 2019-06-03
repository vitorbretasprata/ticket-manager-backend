const User = require('../schemas/user');
const serverError = require('../prototypes/handleError');
const { contextValidation } = require('../helpers/check')

const requestUsers = async (req, res) => {

    const users = await User.find({ company_id: account_id });

    if(!users) {
        return res.status(404).send({
            Status: false,
            Message: "Tickets not found."
        });
    }

    return res.status(200).send({
        Status: true,
        users
    });    
}


const requestUser = async (req, res) => {

    const user = await User.findById(req.params.id);

    if(!user) {
        return res.status(404).send({
            Status: false,
            Message: "Ticket not found."
        });
    }

    return res.status(200).send({
        Status: true,
        user
    });
}

const createUser = async (req, res) => {    

    const context = await validator.contextValidation(res, req.body, { 
        Name: 'required|string|minLength:2',
        Email: 'required|email',
        Password: 'required|minLength:8',
        Login: 'required|string|minLength:2',
        Team: 'required|string',
        Occupation: 'required|string'
    }); 
    
    if(!context) {
        throw new serverError("Auth", "Some fields are worng.", 422, context);
    }

    context.Role = 'user';

    await Ticket.create(context);   

    return res.status(200).send({
        Status: true,
        Message: "User created."
    });       
}

const Filter = async (req, res) => {    

    const context = await validator.contextValidation(res, req.body, { 
        Name: 'string|minLength:2',
        Team: 'string',
        Occupation: 'string'        
    });
    
    query = {};

    if(context.Name){
        query.Name = { $regex: '.*' + context.Name + '.*' };    
    }
    if(context.Team){        
        query.Team = context.Team;    
    }        
    if(context.Occupation){
        query.Occupation = context.Occupation;    
    }    
    
    const users = await User.find(query);

    return res.status(200).send({
        Status: true,
        users
    }); 
}

const deleteUser = async (req, res) => {    

    User.findOneAndDelete({ ID: req.params.id });

    return res.status(200).send({
        Status: false,
        Message: "User deleted."
    });    
}

const editUser = async (req, res) => {    

    const context = validator.contextValidation(res, req.body, { 
        Tame: 'required|string|minLength:2',
        Email: 'required|email',
        Password: 'required|minLength:8',
        Login: 'required|string|minLength:2',
        Team: 'required|string',
        Occupation: 'required|string'
    });

    await User.findOneAndUpdate(req.params.id, context, { new: true });

    return res.status(200).send({
        Status: true,
        Message: "User successfully edited."
    });
}

module.exports = {
    requestUsers,
    deleteUser,
    Filter,
    requestUser,
    createUser,
    editUser
}
