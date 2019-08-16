const bcrypt = require('bcryptjs');

const User = require('../schemas/user');
const validator = require('../helpers/check');
const { sendCode, sendMail } = require('../helpers/mail');
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
    
    const email = await User.findOne({ email: context.email });
    const login = await User.findOne({ login: context.login });

    if(email) {
        throw new serverError('Register', 'Emails already being used.', 422);
    }

    if(login) {
        throw new serverError('Register', 'Login name already being used.', 422);
    }

    var salt = bcrypt.genSaltSync(10);
    context.Password = bcrypt.hashSync(context.Password, salt);

    await User.create(context);

    return res.status(200).send({
        Status: true,
        Message: "User registered with success."
    });       
}

const Login = async (req, res) => {    

    const context = await validator.contextValidation(res, req.body, { Email: 'required|email', Password: 'required|string' });

    if(!context) {
        throw new serverError("Login", "Invalid email or password", 422);
    }

    let user = await User.findOne({ Email: context.Email });

    if(!user) {
        throw new serverError("Login", "Email and password does not match.", 404);
    }

    const compare = bcrypt.compareSync(context.Password, user.Password);

    if(!compare) {
        throw new serverError("Login", "Email and password does not match.", 404);
    }    

    const name = user.Name;

    const token = await generateToken(user);
    
    return res.status(200).send({
        Status: true, 
        Message: "User logged in.",
        token,
        name
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

const sendEmail = async (req, res) => {

    const context = await validator.contextValidation(res, req.body, 
        { 
            firstName: 'required|string',
            lastName: 'required|string',
            email: 'required|email',
            message: 'required|string'
        });

    if(!context) {
        throw new serverError("Send Email", "Invalid data.", 422);
    }

    const sentMessage = await sendMail("vitorbretasprata@gmail.com", 
    context.firstName + " " + context.lastName,
    context.message,
    context.email);

    if(!sentMessage.Status) {
        throw new serverError("Send Email", "An error occuren while sending the email", 500);
    }

    return res.status(200).send({
        Status: true,
        Message: "Message sent."
    });

}


module.exports = {
    Register,
    Login,
    resetPassword,
    checkEmail,
    sendEmail
};