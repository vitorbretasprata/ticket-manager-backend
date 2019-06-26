const Ticket = require('../schemas/ticket');
const validator = require("../helpers/check");
const serverError = require('../prototypes/handleError');

var query = {};

const requestTickets = async (req, res) => {
    let tickets;

    if(res.role == 'admin' || res.role == 'user') {
        tickets = await Ticket.find({ CreatorID: req.accountId }, "FilterID Title Category State");
    } else {
        tickets = await Ticket.find({ CreatorID: req.CompanyID }, "FilterID Title Category State");
    }

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

const requestTicket = async (req, res) => {

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
    
    context.CreatorID = req.accountId;
    context.FilterID = filterID;
    context.Comments = []

    await Ticket.create(context);   

    return res.status(200).send({
        Status: true,
        Message: "Ticket saved."
    });       
}

const addComment = async (req, res) => {    
    
    const context = await validator.contextValidation(res, req.body, { Description: 'required|string|maxLength:500', User: 'required|string'});

    const update = await Ticket.findByIdAndUpdate(req.params.id, {
        $push: {
            Comments: [{
                Comment: context
            }]
        }
    });

    if(!update) {
        throw new serverError("Ticket", "Something happened while adding a comment", 422);
    }

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

    if(!tickets) {
        throw new serverError("Ticket", "Something happened while filtering.", 422);
    }

    return res.status(200).send({
        Status: true,
        Message: "Tickets retrieved.",
        tickets
    }); 
}

const deleteTicket = async (req, res) => {    

    const deleted = Ticket.findOneAndDelete({ ID: req.params.id });

    if(!deleted) {
        throw new serverError("Ticket", "Something happened while deleting the ticket.", 422);
    }

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

    const upated = await Ticket.findOneAndUpdate(req.params.id, context, { new: true });

    if(!upated) {
        throw new serverError("Ticket", "Something happened while updating the ticket.", 422);
    }

    return res.status(200).send({
        Status: true,
        Message: "Tickets successfully edited."
    });
}


module.exports = {
    requestTickets,
    requestTicket,
    createTicket,
    addComment,
    Filter,
    editTicket,
    deleteTicket
}