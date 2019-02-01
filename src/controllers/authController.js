const express = require('express');
const cors = require('cors')

const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const nodemailer = require('nodemailer');

const User = require('../models/user');
const config = require('../config/config');

const router = express();

let transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
        user: config.email, 
        pass: config.passEmail
    }
});  

router.post('/register', (req, res) => {

    let encryptedPassword = bcrypt.hashSync(req.body.userInfo.password, 10);

    User.create({
        Name: req.body.userInfo.name,
        Email: req.body.userInfo.email,
        Password: encryptedPassword,
        Occupation: req.body.userInfo.occupation,
        Team: req.body.userInfo.team,
        Login: req.body.userInfo.login
    },
    (err, User) => {
        if(err){
            return res.status(500).send(err);
        }       

        res.status(200).send({ user: User });
    });
});

router.get('/getUsers', (req, res) => {
    User.find({}, (err, users) => {
        if(!err){
            res.status(200).send({ Users: users });
        }
        else{
            throw err;
        }
    })
})

router.delete('/deleteUsers', (req, res) => {
    User.deleteMany({}, (err, users) => {
        if(!err){
            res.status(200).send({ Users: users });
        }
        else{
            throw err;
        }
    });
});
 
router.post('/login', (req, res) => {    
    User.findOne({
        Email: req.body.email        
    }).exec((err, user) => {
        if(err) {
            throw err;
        }

        if(!user){
            return res.status(404).json({                
                error: true, 
                message: 'User not found'
            });
        } 
        
        if(!bcrypt.compareSync(req.body.password, user.Password)){
            return res.status(404).json({
                error: true,
                message: 'Password or email does not match'   
            })
        }

        const payload = {
            id : user._id,
            name : user.Name
        };

        let token = jwt.sign({payload}, config.secret, { expiresIn: 432000 });

        res.status(200).send({ auth: true, token: token });        
    });
});

router.post('/verify', verifyToken, (req, res) => {
    jwt.verify(req.token, config.secret, (err, authData) => {
        if(err) {
            res.sendStatus(403)
        } else {
            res.json({
                message: "success",
                authData
            });
        }
    });   
});

function verifyToken(req, res, next) {    
    const bearerHeader = req.headers['authorization'];
    if(typeof bearerHeader !== 'undefined') {

        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];

        req.token = bearerToken;

        next();

    } else {
        res.status(403);
    }
}

router.post('/sendCode', (req, res) => {

    User.find({
        Email: req.body.email
    }, (err, user) => {
        if(err){
            return res.status(500).send({ message: "Something failed while validating the email, try again later. If it persist, contact the support." });
        }
        if(typeof user == undefined || user.length == 0){
            return res.status(404).send({ message: "Email not found!" });
        }

        const codeNumber = Math.floor(Math.random() * 10000);

        let mailOptions = {
            from: '"Ticket Manager 👻"',
            to: req.body.email,
            subject: 'Hello ✔',
            text: 'Hello world?',
            html: `
            <b>Your reset code is: ${codeNumber}.</b>
            <p style="color: red"><b>If you didn't request a code to reset your password, ignore this message.</b></p>
            `
        };         
    
        transporter.sendMail(mailOptions, (error, info) => {
            if (error) {
                console.log("Error: " + error);
            } else {
                console.log('Email enviado: ' + info.response);
            }
        });
         
        return res.status(200).send({ Email: req.body.email, Code: codeNumber });
    });
});

router.put('/resetPassword', (req, res) => {

    const encryptedPassword = bcrypt.hashSync(req.body.password, 10);

    User.findOneAndUpdate(req.body.email, { $set: { Password: encryptedPassword }}, 
        { new: true } , (err, User) => {
        if(err){
            return res.status(500).send({ message: "Failed in updating password, try again later. If it persist, contact the support." });
        }
        return res.status(200).send({ User: User }) ;    
    });

});

module.exports = router