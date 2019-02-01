const express = require('express')
const Ticket = require('../models/ticket')

const router = express();

var query = {

};

router.get('/getTickets', (req, res) => {

    Ticket.find({}, (err, tickets) => {
        if(err){
            return res.status(500).send({ error: err});
        }

        return res.status(200).send({ Tickets: tickets});
    })
})

router.get('/getTicket/:id', (req, res) => {

    Ticket.findById(req.params.id,
        (err, Ticket) => {
            if(err){
            return res.status(500).send({ error: err });
        }

        return res.status(200).send({ Ticket: Ticket });
    })
})

router.post('/createTicket', (req, res) => {
    const filterID = Math.floor(Math.random() * 100000);
    Ticket.create({
        FilterID: filterID,
        Title: req.body.Title,
        Description: req.body.Description,
        Importance: req.body.Importance,
        Author: req.body.Author,
        Client: req.body.Client,
        Term: req.body.Term,
        State: req.body.State,
        Category: req.body.Category,
        Comments: []
    }, (err, Ticket) => {
        if(err){
            return res.status(500).send({ Error: err })
        }

        return res.status(200).send({ Ticket: Ticket })
    })
})

router.put('/addComment/:id', (req, res) => {

    let Comment = {    
        Description: req.body.Description,
        User: req.body.User              
    }

    Ticket.findByIdAndUpdate(req.params.id, 
    {
        $push: {
            Comments: [{
                Comment: Comment 
            }]            
        }
    }, { new: true } ,
    (err, Ticket) => {
        if(err){
            return res.status(500).send({ error: err })
        }  
        return res.status(200).send({ Comments: Ticket.Comments });               
    });    
});

router.post('/filter', (req, res) => {
    query = {};

    console.log(req.body);
    if(req.body.ID){        
        query.FilterID = req.body.ID;    
    }
    if(req.body.Title){
        query.Title = { $regex: '.*' + req.body.Title + '.*' };    
    }
    if(req.body.Client){
        query.Client = { $regex: '.*' + req.body.Client + '.*' };    
    }
    if(req.body.Importance){
        query.Importance = req.body.Importance;    
    }
    if(req.body.Author){
        query.Author = req.body.Author;    
    }
    if(req.body.Category){
        query.Category = req.body.Category;    
    }   
    if(req.body.State){
        query.State = req.body.State;    
    }  
    
    Ticket.find(query, (err, Ticket) => {
        if(err){
            return res.status(500).send({ error: err });
        }        

        return res.status(200).send({ Ticket: Ticket, Query: query });
    });
});

router.delete('/deleteTicket/:id',  (req, res) => {

    Ticket.findByIdAndDelete(req.params.id, (err, Ticket) => {
        if(err){
            return res.status(500).send({ error: err })
        }

        return res.status(200).send({ Ticket: Ticket })
    });
});

router.delete('/deleteTickets', (req, res) => {
    Ticket.deleteMany({}, (err, ticket) => {
        if(!err){
            res.status(200).send({ Tickets: ticket });
        }
        else{
            throw err;
        }
    });
});

router.put('/alterTicket/:id', (req, res) => {

    Ticket.findByIdAndUpdate(req.params.id, {

        Title: req.body.Title,
        Description: req.body.Description,
        Importance: req.body.Importance,
        Author: req.body.Author,
        Client: req.body.Client,
        Term: req.body.Term,
        State: req.body.State,
        Category: req.body.Category
     }, { new: true } , (err, Ticket) => {
        if(err){
            return res.status(500).send({ error: err });
        }
        return res.status(200).send({ Ticket: Ticket }) ;    
    });    
});

module.exports = router