const mongoose = require('mongoose')

var connUser = mongoose.createConnection('mongodb://localhost/users', { useNewUrlParser: true })

var UserSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
            index: true,
            trim: true
        },
        Login:{
            type: String,
            required: true,    
            trim: true
        },
        Email: {
            type: String,
            unique: true,
            required: true,
            index: true,
            trim: true
        },
        Password: {
            type: String,
            required: true            
        },
        Occupation: {
            type: String,
            required: true,
            trim: true
        },        
        Team: {
            type: String,
            required: true,
            trim: true
        },
        recoveryCode: {
            type: String,
            trim: true,
            default: '',
        },
    }    
);

UserSchema.index({ Email: 1, Name: 1})

module.exports = connUser.model('User', UserSchema);