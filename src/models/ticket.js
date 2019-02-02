const mongoose = require('mongoose')

var connTicket = mongoose.createConnection('mongodb://localhost/tickets', { useNewUrlParser: true })

var TicketSchema = new mongoose.Schema(
    {
        FilterID:{
            type: Number,
            required: true
        },
        Title: {
            type: String,
            required: true,
            trim: true
        },
        Description: {
            type: String,
            required: true,
            trim: true
        },
        Importance: {
            type: String,
            required: true,
            trim: true
        },
        Author: {
            type: String,
            required: true,
            trim: true
        },
        Client: {
            type: String,
            required: true,
            trim: true
        },
        Term:{
            type: Date,
            required: true,
            default: Date.now        
        },
        DateCreated: {
            type: Date,            
            default: Date.now('dd.mm.yyyy')
        },
        State:{
            type: String,
            required: true            
        },
        Edited:{
            type: Boolean,
            default: false            
        },
        Category:{
            type: String,
            required: true
        },
        Comments:[{
            Comment:{                
                Description: String,
                User: String,
                DateCreated: {type: Date, default: Date.now}
            }
        }]
})

module.exports = connTicket.model('Ticket', TicketSchema);