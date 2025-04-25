// const mongoose = require('mongoose');

// const emailSchema = new mongoose.Schema({
//   email: { type: String, required: true, unique: true },
// });

// const Email = mongoose.model('Email', emailSchema);

// module.exports = Email;
// // // models/User.js - Modified to work with your Email model
// // const mongoose = require('mongoose');

// // // Problem Schema (for individual problems solved)
// // const ProblemSchema = new mongoose.Schema({
// //   origin: {
// //     type: String,
// //     required: true,  // Platform/judge that hosted the problem (e.g., Codeforces, CodeChef)
// //   },
// //   contest: {
// //     type: String,
// //     default: ''      // Contest name/ID if applicable
// //   },
// //   problemId: {
// //     type: String,
// //     default: ''      // Problem identifier if available
// //   },
// //   problemName: {
// //     type: String,
// //     default: ''      // Problem name if available
// //   },
// //   solvedAt: {
// //     type: Date,
// //     required: true   // When this problem was solved
// //   }
// // });

// // // Daily Activity Schema (for tracking daily coding activity)
// // // const DailyActivitySchema = new mongoose.Schema({
// // //   date: {
// // //     type: Date,
// // //     required: true
// // //   },
// // //   count: {
// // //     type: Number,
// // //     default: 0       // Number of problems solved on this date
// // //   },
// // //   platform: {
// // //     type: String,
// // //     required: true   // Which platform this activity is from (VJudge, CodeChef, etc.)
// // //   },
// // //   problems: [ProblemSchema]
// // // });

// // // Platform Profile Schema (for storing platform-specific username/IDs)
// // // const PlatformProfileSchema = new mongoose.Schema({
// // //   platform: {
// // //     type: String,
// // //     required: true   // Platform name (VJudge, CodeChef, CodeForces, etc.)
// // //   },
// // //   username: {
// // //     type: String,
// // //     required: true   // Username on that platform
// // //   },
// // //   lastScraped: {
// // //     type: Date,
// // //     default: null    // When we last scraped data for this platform
// // //   }
// // // });

// // // // Main User Schema
// // // const UserSchema = new mongoose.Schema({
// // //   name: {
// // //     type: String,
// // //     required: true
// // //   },
// // //   emailId: {
// // //     type: mongoose.Schema.Types.ObjectId,
// // //     ref: 'Email',    // Reference to your Email model
// // //     required: false  // Optional reference to email
// // //   },
// // //   platformProfiles: [PlatformProfileSchema],
// // //   dailyActivities: [DailyActivitySchema],
// // //   createdAt: {
// // //     type: Date,
// // //     default: Date.now
// // //   },
// // //   updatedAt: {
// // //     type: Date,
// // //     default: Date.now
// // //   }
// // // });

// // // // Middleware to update the updatedAt field
// // // UserSchema.pre('save', function(next) {
// // //   this.updatedAt = Date.now();
// // //   next();
// // // });

// // module.exports = mongoose.model('User', UserSchema);