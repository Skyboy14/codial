const nodemailer = require('../config/nodemailer');


//this is another way of exporting a method
exports.newComment = (comment) => {
    let htmlString = nodemailer.renderTemplate({ comment: comment }, `/comments/new_comment.ejs`);

    nodemailer.transporter.sendMail({
        from: 'akashcoddingnijjatestacc@gmail.com', // sender address
        to: comment.user.email, // list of receivers
        subject: "New comment publish", // Subject line
        html: htmlString, // html body
    }).then((info) => {
        console.log('Mail send', info);
        return;
    }).catch((err) => {
        console.log('error in sending mail ', err);
        return;

    });
}

