const mailGun = require("mailgun-js")({ apiKey: process.env.SECRET_KEY, domain: process.env.EMAIL });

const sendMail = async(to, subject, text, from = process.env.EMAIL) => {

    const data = { from, to, subject, text }

        mailGun.messages().send(data, (error, body) => {
        console.log(body);
    });

    if (!send) {
        return {
            Status: false,
            Message: "Failed to send message"
        }
    }

    return {
        Status: true,
        Message: "Message sent."
    }
}

const sendCode = async (email) => {

    try {
        const user = await User.find({ Email: req.body.email });

        if(!user) {
            return res.status(500).send({ message: "Something failed while validating the email, try again later. If it persist, contact the support." });
        }
    
        if(typeof user == undefined || user.length == 0){
            return res.status(404).send({ message: "Email not found!" });
        }        
    
        const codeNumber = Math.floor(Math.random() * 10000);
    
        let text = `<b>Your reset code is: ${codeNumber}.</b>
            <p style="color: red"><b>If you didn't request a code to reset your password, ignore this message.</b></p>`;
         
        
        const mail = await sendMail(email, 'Reset code ✔', text);
        
        return {
            mail,
            codeNumber
        };    

    } catch(error) {
        return error;
    }      
}

module.exports = {
    sendMail,
    sendCode
}