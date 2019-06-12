const authModel = require('../models/authModel')

const Register = async (req, res) => {
    try {
        const response = await authModel.Register(req, res);
        return response;
    } catch (error) {
        return error;
    }
}

const Login = async (req, res) => {
    try {
        const response = await authModel.Login(req, res);
        return response;
    } catch (error) {
        return res.send({error});
    }
}

const resetPassword = async (req, res) => {
    try {
        const response = await authModel.resetPassword(req, res);
        return response;
    } catch (error) {
        return error;
    }
}

const checkEmail = async (req, res) => {
    try {
        const response = await authModel.checkEmail(req, res);
        return response;
    } catch (error) {
        return error;
    }
}

module.exports = {
    Register,
    Login,
    resetPassword,
    checkEmail
};