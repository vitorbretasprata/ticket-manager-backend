const adminModel = require("../models/adminModel")

const requestUsers = async (req, res) => {
    try {
        const requestUsers = await adminModel.requestUsers(req, res);
        return requestUsers;
    } catch (error) {
        return res.send({ error });
    }
}

const requestUser = async (req, res) => {
    try {
        const requestUser = await adminModel.requestUser(req, res);
        return requestUser;
    } catch (error) {
        return res.send({ error });
    }
}

const createUser = async (req, res) => {
    try {
        const createUser = await adminModel.createUser(req, res);
        return createUser;
    } catch (error) {
        return res.send({ error });
    }
}

const editUser = async (req, res) => {
    try {
        const editUser = await adminModel.editUser(req, res);
        return editUser;
    } catch (error) {
        return res.send({ error });
    }
}

const Filter = async (req, res) => {
    try {
        const Filter = await adminModel.Filter(req, res);
        return Filter;
    } catch (error) {
        return res.send({ error });
    }
}

const deleteUser = async (req, res) => {
    try {
        const deleteUser = await adminModel.deleteUser(req, res);
        return deleteUser;
    } catch (error) {
        return res.send({ error });
    }
}

module.exports = {
    requestUsers,
    requestUser,
    createUser,
    editUser,
    Filter,
    deleteUser
}