const ticketModel = require('../models/ticketModel')

const requestTickets = async (req, res) => {
    try {
        const response = await ticketModel.requestTickets(req, res);
        return response;
    } catch (error) {
        return res.send({ error });
    }
}

const requestTicket = async (req, res) => {
    try {
        const response = await ticketModel.requestTicket(req, res);
        return response;
    } catch (error) {
        return res.send({ error });
    }
}

const createTicket = async (req, res) => {
    try {
        const response = await ticketModel.createTicket(req, res);
        return response;
    } catch (error) {
        return res.send({ error });
    }
}

const addComment = async (req, res) => {
    try {
        const response = await ticketModel.addComment(req, res);
        return response;
    } catch (error) {
        return res.send({ error });
    }
}

const Filter = async (req, res) => {
    try {
        const response = await ticketModel.Filter(req, res);
        return response;
    } catch (error) {
        return res.send({ error });
    }
}

const deleteTicket = async (req, res) => {
    try {
        const response = await ticketModel.deleteTicket(req, res);
        return response;
    } catch (error) {
        return res.send({ error });
    }
}

const editTicket = async (req, res) => {
    try {
        const response = await ticketModel.editTicket(req, res);
        return response;
    } catch (error) {
        return res.send({ error });
    }
}

module.exports = {
    requestTickets,
    requestTicket,
    createTicket,
    addComment,
    Filter,
    deleteTicket,
    editTicket
};