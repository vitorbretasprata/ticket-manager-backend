const bcrypt = require('bcryptjs');

const User = require('../schemas/user');
const validator = require('../helpers/check');
const { sendCode } = require('../helpers/mail');
const errorHandler = require("../prototypes/handleError");


var MyError3 = (function() {
    function F(){}
    function CustomError() {
       var _this = (this===window) ? new F() : this,
           tmp = Error.prototype.constructor.apply(_this,arguments)
       ;
       for (var i in tmp) {
          if (tmp.hasOwnProperty(i)) _this[i] = tmp[i];
       }
       return _this;
    }
    function SubClass(){}
    SubClass.prototype = Error.prototype;
    F.prototype = CustomError.prototype = new SubClass();
    CustomError.prototype.constructor = CustomError;
    return CustomError;
 })();

const Register = async (req, res) => {

    const context = await validator.contextValidation(res, req.body, { 
        Name: 'required|string|minLength:2',
        Email: 'required|email',
        Password: 'required|minLength:8',
        Login: 'required|string|minLength:2',
        Team: 'required|string',
        Occupation: 'required|string'
    });

    context.Password = await bcrypt.hash(context.Password, 10);      

    await User.create(context);

    return res.status(200).send({
        Status: true,
        Message: "User registered with success."
    });       
}

const Login = async (req, res) => {    

    const context = await validator.contextValidation(res, req.body, { email: 'required|email', password: 'required|string' });

    if(!context) {
        throw new MyError3("teste");
    }

    let encryptedPassword = await bcrypt.hash(context.password, 10);

    const user = await User.findOne({ username: context.username, password: encryptedPassword })

    if(!user) {
        return res.status(404).send({
            Status: false,
            Message: "User not found."
        });
    }

    const token = await generateToken(user);

    return res.status(200).send({
        Status: true, 
        Message: "User logged in.",
        Token: token
    });        
}

const checkEmail = async (req, res) => {

    const context = await validator.contextValidation(res, req.body, { email: 'required|email' });

    if(!valid) {
        return res.status(422).send({
            Status: false,
            Message: "Invalid email."
        });
    }

    const email = await User.findOne({ Email: context.email });

    if(!email) {
        return res.status(422).send({
            Status: false,
            Message: "Email not found on our database."
        });
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
        return res.status(422).send({
            Status: false,
            Message: "Somethig failed when changing the password."
        });
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