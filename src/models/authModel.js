const bcrypt = require('bcryptjs');

const User = require('../schemas/user');
const validator = require('../helpers/check');
const { sendCode } = require('../helpers/mail');
const serverError = require('../prototypes/handleError');
const { generateToken } = require("../helpers/checkJWT");

const Register = async (req, res) => {

    const context = await validator.contextValidation(res, req.body, { 
        Name: 'required|string|minLength:2',
        Email: 'required|email',
        Password: 'required|minLength:8',
        Login: 'required|string|minLength:2',
        Role: 'required|string'
    });

    if(!context) {
        throw new serverError("Register", "Invalid fields", 422, context);
    }

    var salt = bcrypt.genSaltSync(10);

    context.Password = bcrypt.hashSync(context.Password, salt);
    
    const email = await User.findOne({ email: context.email });

    const login = await User.findOne({ login: context.login });


    if(email) {
        throw new serverError('Register', 'Emails already being used.', 422);
    }

    if(login) {
        throw new serverError('Register', 'Login name already being used.', 422);
    }

    await User.create(context);

    return res.status(200).send({
        Status: true,
        Message: "User registered with success."
    });       
}

const Login = async (req, res) => {    

    const context = await validator.contextValidation(res, req.body, { email: 'required|email', password: 'required|string' });

    if(!context) {
        throw new serverError("Login", "Invalid email or password", 422);
    }

    var salt = await bcrypt.genSaltSync(10);

    let encryptedPassword = bcrypt.hashSync(context.password, salt);

    const user = await User.findOne({ Email: context.email, Password: encryptedPassword });

    if(!user) {
        throw new serverError("Login", "Email and password does not match.", 404);
    }

    const token = await generateToken(user);

    return res.status(200).send({
        Status: true, 
        Message: "User logged in.",
        token
    });        
}

const checkEmail = async (req, res) => {

    const context = await validator.contextValidation(res, req.body, { email: 'required|email' });

    if(!context) {
        throw new serverError("Check Email", "Invalid email.", 422);
    }

    const email = await User.findOne({ Email: context.email });

    if(!email) {
        throw new serverError("Check Email", "Email not found.", 404);
    }

    const sentMessage = await sendCode(context.email);

    if(!sentMessage) {
        return res.status(422).send({
            Status: false,
            Message: "Some error ocurred while sending the message."
        }); 
    }

    return res.status(200).send({ sentMessage });   
}

const resetPassword = async (req, res) => {

    const context = await validator.contextValidation(res, req.body, { password: 'required|string|min:8', confirm:'required|same:confirm_password' });
    
    let encryptedPassword = await bcrypt.hash(context.password, 10);

    const user = await User.findOneAndUpdate(req.body.email, { $set: { Password: encryptedPassword }});

    if(!user) {
        throw new serverError("Reset Password", "Somethig failed when changing the password.", 422);
    }

    return res.status(200).send({
        Status: true,
        Message: "Successfuly changed password."
    });       
}    

module.exports = {
    Register,
    Login,
    resetPassword,
    checkEmail    
};