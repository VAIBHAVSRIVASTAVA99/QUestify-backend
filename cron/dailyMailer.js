const cron = require('node-cron');
const nodemailer = require('nodemailer');
const Email = require('../models/Email');
const { fetchRandomQuestion } = require('../services/problemService');

const sendDailyProblemEmail = async () => {
  try {
    const emails = await Email.find({}, 'email');
    if (!emails.length) return console.log('No subscribers found.');

    const question = await fetchRandomQuestion();
    if (!question) return console.log('Failed to fetch a question.');

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    for (let user of emails) {
      const mailOptions = {
        from: process.env.EMAIL_USER,
        to: user.email,
        subject: `Your Daily ${question.platform} Coding Challenge`,
        html: `<h1>${question.platform} Question</h1>
               <p><strong>${question.title}</strong></p>
               <p>Difficulty: ${question.difficulty}</p>
               <p><a href="${question.url}" target="_blank">Solve this problem</a></p>`,
      };

      transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.error(`Error sending email to ${user.email}:`, error);
        else console.log(`Email sent to ${user.email}: ${info.response}`);
      });
    }
  } catch (error) {
    console.error('Error sending daily emails:', error);
  }
};

// ✅ Wrap the cron job in a function so server.js can call it
const scheduleDailyEmail = () => {
  cron.schedule(
    '30 3 * * *',
    () => {
      console.log('Running daily coding challenge email at 9:00 AM IST...');
      sendDailyProblemEmail();
    },
    {
      scheduled: true,
      timezone: 'Asia/Kolkata',
    }
  );
};

module.exports = scheduleDailyEmail;
