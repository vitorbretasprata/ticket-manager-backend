const Ticket = require('../schemas/ticket');
const validator = require("../helpers/check");

var query = {};

const getTickets = async (req, res) => {

    const tickets = await Ticket.find({});

    if(!tickets) {
        return res.status(404).send({
            Status: false,
            Message: "Tickets not found."
        });
    }

    return res.status(200).send({
        Status: true,
        Message: "Tickets gotten with success.",
        tickets
    });
}

const getTicket = async (req, res) => {

    const ticket = await Ticket.findById(req.params.id);

    if(!ticket) {
        return res.status(404).send({
            Status: false,
            Message: "Ticket not found."
        });
    }

    return res.status(200).send({
        Status: true,
        Message: "Tickets gotten with success.",
        ticket
    });
}

const createTicket = async (req, res) => {    

    const context = await validator.contextValidation(res, req.body, { 
        Title: 'required|string|maxLength:50',
        Description: 'required|string|maxLength:500',
        Importance: 'required|string',
        Author: 'required|string',
        Client: 'required|string',
        Term: 'required|string',
        State: 'required|string',
        Category: 'required|string'
        });
        
    let filterID = Math.floor(Math.random() * 100000);

    const tickets = await Ticket.find({}, "FilterID");

    while(filterID in tickets) {
        filterID = Math.floor(Math.random() * 100000);
    }

    context.FilterID = filterID;
    context.Comments = []

    await Ticket.create(valid);   

    return res.status(200).send({
        Status: true,
        Message: "Ticket saved."
    });       
}

const addComment = async (req, res) => {    
    
    const context = await validator.contextValidation(res, req.body, { Description: 'required|string|maxLength:500', User: 'required|string'});

    await Ticket.findByIdAndUpdate(req.params.id, {
        $push: {
            Comments: [{
                Comment: context
            }]
        }
    });

    return res.status(200).send({
        Status: true,
        Message: "Comment added."
    });       
    
}

const Filter = async (req, res) => {    

    const context = await validator.contextValidation(res, req.body, { 
        ID: 'int|maxLength:50',
        Title: 'string|maxLength:500',
        Client: 'string',
        Importance: 'string',
        Author: 'string',
        State: 'string',
        Category: 'string'
    });
    
    query = {};

    if(context.ID){        
        query.FilterID = context.ID;    
    }
    if(context.Title){
        query.Title = { $regex: '.*' + context.Title + '.*' };    
    }
    if(context.Client){
        query.Client = { $regex: '.*' + context.Client + '.*' };    
    }
    if(context.Importance){
        query.Importance = context.Importance;    
    }
    if(context.Author){
        query.Author = context.Author;    
    }
    if(context.Category){
        query.Category = context.Category;    
    }   
    if(context.State){
        query.State = context.State;    
    } 
    
    const tickets = await Ticket.find(context);

    return res.status(200).send({
        Status: true,
        Message: "Tickets retrieved.",
        tickets
    }); 
}

const deleteTicket = async (req, res) => {    

    Ticket.findOneAndDelete({ ID: req.params.id });

    return res.status(200).send({
        Status: false,
        Message: "Ticket deleted."
    });    
}

const editTicket = async (req, res) => {    

    const context = validator.contextValidation(res, req.body, { 
        Title: 'string|maxLength:50',
        Description: 'string|maxLength:500',
        Importance: 'string',
        Author: 'string',
        Client: 'string',
        Term: 'string',
        State: 'string',
        Category: 'string'
    });

    await Ticket.findOneAndUpdate(req.params.id, context, { new: true });

    return res.status(200).send({
        Status: true,
        Message: "Tickets successfully edited."
    });
}


module.exports = {
    getTickets,
    getTicket,
    createTicket,
    addComment,
    Filter,
    editTicket,
    deleteTicket
}