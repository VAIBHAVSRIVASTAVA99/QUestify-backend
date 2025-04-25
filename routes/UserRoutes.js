// // routes/userRoutes.js - Modified to work with Email model
// const express = require('express');
// const router = express.Router();
// const User = require('../models/User');
// const Email = require('../models/Email');

// // Create a new user or update an existing one
// router.post('/', async (req, res) => {
//   try {
//     const { name, email, platformProfiles } = req.body;
    
//     if (!name) {
//       return res.status(400).json({
//         success: false,
//         error: 'User name is required'
//       });
//     }
    
//     // Check if user already exists
//     let user = await User.findOne({ name }).populate('emailId');
//     let emailDoc = null;
    
//     // Handle email if provided
//     if (email) {
//       try {
//         // Find existing email or create new one
//         emailDoc = await Email.findOne({ email });
        
//         if (!emailDoc) {
//           emailDoc = new Email({ email });
//           await emailDoc.save();
//         }
//       } catch (emailError) {
//         console.error('Error handling email:', emailError);
//         return res.status(400).json({
//           success: false,
//           error: 'Email already exists or is invalid'
//         });
//       }
//     }
    
//     if (user) {
//       // Update existing user
//       if (emailDoc) {
//         user.emailId = emailDoc._id;
//       }
      
//       // Update platform profiles if provided
//       if (platformProfiles && Array.isArray(platformProfiles)) {
//         for (const profile of platformProfiles) {
//           if (!profile.platform || !profile.username) continue;
          
//           const existingIndex = user.platformProfiles.findIndex(
//             p => p.platform === profile.platform
//           );
          
//           if (existingIndex >= 0) {
//             user.platformProfiles[existingIndex].username = profile.username;
//           } else {
//             user.platformProfiles.push({
//               platform: profile.platform,
//               username: profile.username
//             });
//           }
//         }
//       }
      
//       await user.save();
      
//       // Prepare response with email
//       const userResponse = {
//         id: user._id,
//         name: user.name,
//         email: emailDoc ? emailDoc.email : (user.emailId ? user.emailId.email : null),
//         platformProfiles: user.platformProfiles,
//         createdAt: user.createdAt,
//         updatedAt: user.updatedAt
//       };
      
//       return res.json({
//         success: true,
//         message: 'User updated successfully',
//         user: userResponse
//       });
//     } else {
//       // Create new user
//       user = new User({
//         name,
//         emailId: emailDoc ? emailDoc._id : null,
//         platformProfiles: platformProfiles || []
//       });
      
//       await user.save();
      
//       // Prepare response with email
//       const userResponse = {
//         id: user._id,
//         name: user.name,
//         email: emailDoc ? emailDoc.email : null,
//         platformProfiles: user.platformProfiles,
//         createdAt: user.createdAt,
//         updatedAt: user.updatedAt
//       };
      
//       return res.status(201).json({
//         success: true,
//         message: 'User created successfully',
//         user: userResponse
//       });
//     }
//   } catch (error) {
//     console.error('Error creating/updating user:', error);
//     return res.status(500).json({
//       success: false,
//       error: error.message || 'Failed to create/update user'
//     });
//   }
// });

// // Get all users
// router.get('/', async (req, res) => {
//   try {
//     const users = await User.find().populate('emailId').select('name emailId platformProfiles createdAt updatedAt');
    
//     // Format response
//     const formattedUsers = users.map(user => ({
//       id: user._id,
//       name: user.name,
//       email: user.emailId ? user.emailId.email : null,
//       platformProfiles: user.platformProfiles,
//       createdAt: user.createdAt,
//       updatedAt: user.updatedAt
//     }));
    
//     return res.json({
//       success: true,
//       count: users.length,
//       users: formattedUsers
//     });
//   } catch (error) {
//     console.error('Error fetching users:', error);
//     return res.status(500).json({
//       success: false,
//       error: error.message || 'Failed to fetch users'
//     });
//   }
// });

// // Get a specific user by name
// router.get('/:name', async (req, res) => {
//   try {
//     const { name } = req.params;
    
//     const user = await User.findOne({ name }).populate('emailId');
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: `User '${name}' not found`
//       });
//     }
    
//     // Calculate total problems across all platforms
//     const totalProblems = user.dailyActivities.reduce(
//       (sum, activity) => sum + activity.count, 0
//     );
    
//     // Group activities by platform
//     const platforms = {};
    
//     user.platformProfiles.forEach(profile => {
//       platforms[profile.platform] = {
//         username: profile.username,
//         lastScraped: profile.lastScraped,
//         totalProblems: 0,
//         activities: []
//       };
//     });
    
//     user.dailyActivities.forEach(activity => {
//       if (platforms[activity.platform]) {
//         platforms[activity.platform].totalProblems += activity.count;
//         platforms[activity.platform].activities.push(activity);
//       }
//     });
    
//     // Sort activities by date (newest first)
//     Object.keys(platforms).forEach(platform => {
//       platforms[platform].activities.sort((a, b) => 
//         new Date(b.date) - new Date(a.date)
//       );
//     });
    
//     return res.json({
//       success: true,
//       user: {
//         id: user._id,
//         name: user.name,
//         email: user.emailId ? user.emailId.email : null,
//         totalProblems,
//         platforms,
//         createdAt: user.createdAt,
//         updatedAt: user.updatedAt
//       }
//     });
//   } catch (error) {
//     console.error('Error fetching user:', error);
//     return res.status(500).json({
//       success: false,
//       error: error.message || 'Failed to fetch user'
//     });
//   }
// });

// // Delete a specific user
// router.delete('/:name', async (req, res) => {
//   try {
//     const { name } = req.params;
    
//     const user = await User.findOne({ name });
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: `User '${name}' not found`
//       });
//     }
    
//     // Note: We're not deleting the email document since it might be referenced by other users
    
//     await User.deleteOne({ _id: user._id });
    
//     return res.json({
//       success: true,
//       message: `User '${name}' deleted successfully`
//     });
//   } catch (error) {
//     console.error('Error deleting user:', error);
//     return res.status(500).json({
//       success: false,
//       error: error.message || 'Failed to delete user'
//     });
//   }
// });

// // Add or update a platform profile for a user
// router.post('/:name/platform', async (req, res) => {
//   try {
//     const { name } = req.params;
//     const { platform, username } = req.body;
    
//     if (!platform || !username) {
//       return res.status(400).json({
//         success: false,
//         error: 'Platform and username are required'
//       });
//     }
    
//     const user = await User.findOne({ name });
    
//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         error: `User '${name}' not found`
//       });
//     }
    
//     const existingIndex = user.platformProfiles.findIndex(
//       p => p.platform === platform
//     );
    
//     if (existingIndex >= 0) {
//       user.platformProfiles[existingIndex].username = username;
//     } else {
//       user.platformProfiles.push({
//         platform,
//         username
//       });
//     }
    
//     await user.save();
    
//     return res.json({
//       success: true,
//       message: `Platform '${platform}' profile updated for user '${name}'`,
//       platformProfile: {
//         platform,
//         username
//       }
//     });
//   } catch (error) {
//     console.error('Error updating platform profile:', error);
//     return res.status(500).json({
//       success: false,
//       error: error.message || 'Failed to update platform profile'
//     });
//   }
// });