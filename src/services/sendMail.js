const nodemailer = require('nodemailer');

let send = nodemailer.createTransport({
        host: process.env.mail_host,
        port: process.env.mail_port,
        secure: true,
        auth: {
            user: process.env.mail_user,
            pass: process.env.mail_pass
        }
    },
    {
        from: `USOF <${process.env.mail_user}>`,
    })

const mailer = message => {
    send.sendMail(message,(err, info) => {
        if(err) return console.log(err)
        console.log('Send mail: ', info)
    })
}



module.exports = mailer