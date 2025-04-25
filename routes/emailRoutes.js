const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const Email = require('../models/Email'); // Adjust path
const {
  fetchRandomLeetCodeQuestion,
  fetchRandomCodeforcesQuestion,
  fetchRandomCodeChefQuestion
} = require('../services/problemService'); // Adjust path if needed

router.post('/store-email', async (req, res) => {
  const { email, platform } = req.body;
  if (!email || !platform)
    return res.status(400).send('Email and platform are required');

  let fetchQuestion;
  if (platform === 'LeetCode') fetchQuestion = fetchRandomLeetCodeQuestion;
  else if (platform === 'Codeforces') fetchQuestion = fetchRandomCodeforcesQuestion;
  else if (platform === 'Codechef') fetchQuestion = fetchRandomCodeChefQuestion;
  else
    return res
      .status(400)
      .json({ status: 'failure', message: 'Invalid platform selected.' });

  try {
    const savedEmail = await Email.findOneAndUpdate(
      { email },
      { email },
      { upsert: true, new: true }
    );

    // ✅ FIXED: Call the function with parentheses
    const question = await fetchQuestion();
    if (!question)
      return res
        .status(500)
        .json({ status: 'failure', message: 'Failed to fetch a problem.' });

    const transporter = nodemailer.createTransport({
      host: 'smtp.gmail.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Welcome! ${platform} Question`,
      html: `<h1>${platform} Question</h1>
             <p><strong>${question.title}</strong></p>
             <p>Difficulty: ${question.difficulty}</p>
             <p><a href="${question.url}" target="_blank">Solve this problem</a></p>`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error('Error sending email:', error);
        return res
          .status(500)
          .json({ status: 'failure', message: 'Failed to send email.' });
      } else {
        return res.status(200).json({
          status: 'success',
          message: `Welcome email sent to ${email} with a ${platform} coding problem.`,
          data: question,
        });
      }
    });
  } catch (error) {
    console.error('Error saving email:', error);
    res
      .status(500)
      .send('An error occurred while saving the email.');
  }
});

module.exports = router;
