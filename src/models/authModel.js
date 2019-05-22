const bcrypt = require('bcryptjs');

const User = require('../schemas/user');
const validator = require('../helpers/check');
const { sendCode } = require('../helpers/mail')

const Register = async (req, res) => {
    try {

        const checkValid = validator.check(req.body.userInfo, { name: 'required|string|min:2', email: 'required|email', password: 'required|min:8', login: 'required|string|min:2'})
        const valid = await checkValid.check();
    
        let encryptedPassword = await bcrypt.hash(valid.password, 10);
    
        const body = {
            Name: valid.name,
            Email: valid.email,
            Password: encryptedPassword,
            Occupation: valid.occupation,
            Team: valid.team,
            Login: valid.login
        }
    
        await User.create(body);
    
        return res.status(200).send({
            Status: true,
            Message: "User registered with success."
        });

    } catch (error) {
        return res.status(500).send({
            Status: false,
            Message: "An error has ocurred.",
            error
        });
    }    
}

const Login = async (req, res) => {

    try {

        const checkValid = validator.check(req.body, { email: 'required|email', password: 'required|string' })
        const valid = await checkValid.check();
    
        if(!valid) {
            return res.status(422).send({
                Status: false,
                Message: "Invalid user."
            });
        }
    
        let encryptedPassword = await bcrypt.hash(req.body.password, 10);
    
        const user = await User.findOne({ username: req.body.username, password: encryptedPassword })
    
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

    } catch (error) {
        return res.status(500).send({
            Status: false,
            Message: "An error has ocurred.",
            error
        });
    }    
}

const checkEmail = async (req, res) => {

    try {

        const checkValid = validator.check(req.body, { email: 'required|email' })
        const valid = await checkValid.check();
    
        if(!valid) {
            return res.status(422).send({
                Status: false,
                Message: "Invalid email."
            });
        }
    
        const email = await User.findOne({ Email: req.body.email });
    
        if(!email) {
            return res.status(422).send({
                Status: false,
                Message: "Email not found on our database."
            });
        }
    
        const sentMessage = await sendCode(req.body.email);
    
        if(!sentMessage) {
            return res.status(422).send({
                Status: false,
                Message: "Some error ocurred while sending the message."
            }); 
        }
    
        return res.status(200).send({ sentMessage }); 

    } catch(error) {
        return res.status(500).send({
            Status: false,
            Message: "Email not found on our database."
        });
    }    
}

const resetPassword = async (req, res) => {

    try {
        
        let encryptedPassword = await bcrypt.hash(req.body.password, 10);

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

    } catch(error) {
        return res.status(500).send({
            Status: false,
            Message: "Somethig failed when changing the password."
        });
    }    
}
       
    

module.exports = {
    Register,
    Login,
    resetPassword,
    checkEmail    
};