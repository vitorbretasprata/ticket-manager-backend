const Ticket = require('../schemas/ticket');
const validator = require("../helpers/check");
const serverError = require('../prototypes/handleError');
const mongoose = require('mongoose');

var query = {};

const requestTickets = async (req, res) => {
    let tickets;

    if(res.role == 'admin' || res.role == 'user') {
        tickets = await Ticket.find({ CreatorID: req.accountId }, "FilterID Title Category Status").sort([['DateCreated', -1]]);
    } else {
        tickets = await Ticket.find({ CreatorID: req.CompanyID }, "FilterID Title Category Status").sort([['DateCreated', -1]]);
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
        Title: 'required|string|maxLength:80',
        Description: 'required|string|maxLength:5000',
        Importance: 'string',
        Client: 'string',
        Term: 'string',
        Status: 'string',
        Category: 'string'
    });
        
    let filterID = Math.floor(Math.random() * 100000);

    const tickets = await Ticket.find({}, "FilterID");

    while(filterID in tickets) {
        filterID = Math.floor(Math.random() * 100000);
    }
    
    context.CreatorID = req.accountId;
    context.FilterID = filterID;
    context.Author = req.name;
    context.Comments = []

    await Ticket.create(context);   

    return res.status(200).send({
        Status: true,
        Message: "Ticket saved."
    });       
}

const addComment = async (req, res) => {    
    
    const context = await validator.contextValidation(res, req.body, { Description: 'required|string|maxLength:1000'});

    context.User = req.name;

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
        ID: 'string|maxLength:50',
        Title: 'string|maxLength:500',
        Client: 'string',
        Importance: 'string',
        Author: 'string',
        Status: 'string',
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
    if(context.Status){
        query.Status = context.Status;    
    } 

    query.CreatorID = req.accountId;
    
    const tickets = await Ticket.find(query);

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

    await Ticket.findOneAndDelete({ _id: req.params.id });

    return res.status(200).send({
        Status: false,
        Message: "Ticket deleted."
    });    
}

const editTicket = async (req, res) => {    

    const context = await validator.contextValidation(res, req.body, { 
        Title: 'string|maxLength:50',
        Description: 'string|maxLength:500',
        Importance: 'string',
        Client: 'string',
        Term: 'string',
        Status: 'string',
        Category: 'string'
    });

    context.Author = req.name;

    const upated = await Ticket.findOneAndUpdate(req.params.id, context);

    if(!upated) {
        throw new serverError("Ticket", "Something happened while updating the ticket.", 422);
    }

    return res.status(200).send({
        Status: true,
        Message: "Tickets successfully edited."
    });
}

const requestInfo = async (req, res) => {
    let news, completed, active, deadline;

    const date = new Date();

    if(res.role == 'admin' || res.role == 'user') {
        news = await Ticket.countDocuments({ CreatorID: req.accountId });
        completed = await Ticket.countDocuments(
            { 
                CreatorID: req.accountId, 
                $or:[{
                    status: 'Done'
                },{
                    status: 'Delivered'
                },{
                    status: 'Archived'
                }]
            });
        active = await Ticket.countDocuments(
            { 
                CreatorID: req.accountId, 
                $or:[{
                    status: 'To Do'
                },{
                    status: 'Doing'
                }]
            });
        deadline = await Ticket.countDocuments(
            { 
                CreatorID: req.accountId, 
                Term: { $gte: date }
            });
    } else {
        news = await Ticket.countDocuments({ CreatorID: req.CompanyID });
        completed = await Ticket.countDocuments(
            { 
                CreatorID: req.CompanyID, 
                $or:[{
                    status: 'Done'
                },{
                    status: 'Delivered'
                },{
                    status: 'Archived'
                }]
            });
        active = await Ticket.countDocuments(
            { 
                CreatorID: req.CompanyID, 
                $or:[{
                    status: 'To Do'
                },{
                    status: 'Doing'
                }]
            });
        deadline = await Ticket.countDocuments(
            { 
                CreatorID: req.CompanyID, 
                Term: { $gte: date }
            });
    }

    return res.status(200).send({
        Status: true,
        Message: "Info successfuly got.",
        news,
        completed,
        active,
        deadline
    });
}

const requestQuantity = async (req, res) => {    
    const result = await Ticket.aggregate([
    {
        $match: { CreatorID: new mongoose.Types.ObjectId(req.accountId) }
    },
    {
        $group: { 
            _id: { 
                year: { $year: "$DateCreated" }, 
                month: { $month: "$DateCreated"}
            },
            result: { $sum: 1 }
        }
    }]);    

    return res.status(200).send({
        Status: true,
        Message: "Quantity succefully gotten.",
        result
    });
}


module.exports = {
    requestTickets,
    requestTicket,
    createTicket,
    addComment,
    Filter,
    editTicket,
    deleteTicket,
    requestInfo,
    requestQuantity
}