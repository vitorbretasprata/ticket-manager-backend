const authModel = require('../models/authModel')

const Register = async (req, res) => {
    try {
        const response = await authModel.Register(req, res);
        return response;
    } catch (error) {
        return res.send({ error });
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
        return res.send({ error });
    }
}

const checkEmail = async (req, res) => {
    try {
        const response = await authModel.checkEmail(req, res);
        return response;
    } catch (error) {
        return res.send({ error });
    }
}

const sendEmail = async (req, res) => {
    try {
        const response = await authModel.sendEmail(req, res);
        return response;
    } catch (error) {
        return res.send({ error });
    }
}

module.exports = {
    Register,
    Login,
    resetPassword,
    checkEmail,
    sendEmail
};