import express from 'express';
import nodemailer from 'nodemailer';
const emailRouter = express.Router();

const transporter = nodemailer.createTransport({
  host: 'smtp-mail.outlook.com',
  port: 587,
  secure: false,
  auth: {
    user: 'investmentsim.no-reply@outlook.com',
    pass: '1234567890!_',
  },
});

emailRouter.post('/send', async (req, res) => {
  console.log('email trigger')
  try {
    const email = req.body.email;
    const gameId = req.body.gameId;

    const mailOptions = {
      from: 'investmentsim.no-reply@outlook.com',
      to: email,
      subject: "Game Link",
      text: "Hello world?",
      html: `<a href="http://localhost:3000/game/:${gameId}">Click here to go to join the game!</a>`,
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent: ' + info.response);
      }
    });

    res.status(200).send('Links sent');
  } catch (e) {
    console.log(e);
    res.status(404).send('Link sending failed');
  }
});

export default emailRouter;