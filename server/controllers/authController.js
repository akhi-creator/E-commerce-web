const User = require('../models/User');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({
                success: false,
                message: 'User already exists with this email'
            });
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate email & password
        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'Please provide an email and password'
            });
        }

        // Check for user
        const user = await User.findOne({ email }).select('+password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        // Check if password matches
        const isMatch = await user.matchPassword(password);

        if (!isMatch) {
            return res.status(401).json({
                success: false,
                message: 'Invalid credentials'
            });
        }

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Logout user / clear cookie
// @route   GET /api/auth/logout
// @access  Private
exports.logout = async (req, res) => {
    res.cookie('token', 'none', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.status(200).json({
        success: true,
        message: 'Logged out successfully'
    });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/updateprofile
// @access  Private
exports.updateProfile = async (req, res) => {
    try {
        const fieldsToUpdate = {
            name: req.body.name,
            email: req.body.email,
            phone: req.body.phone,
            address: req.body.address
        };

        // Remove undefined fields
        Object.keys(fieldsToUpdate).forEach(key =>
            fieldsToUpdate[key] === undefined && delete fieldsToUpdate[key]
        );

        const user = await User.findByIdAndUpdate(req.user.id, fieldsToUpdate, {
            new: true,
            runValidators: true
        });

        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update password
// @route   PUT /api/auth/updatepassword
// @access  Private
exports.updatePassword = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('+password');

        // Check current password
        if (!(await user.matchPassword(req.body.currentPassword))) {
            return res.status(401).json({
                success: false,
                message: 'Current password is incorrect'
            });
        }

        user.password = req.body.newPassword;
        await user.save();

        sendTokenResponse(user, 200, res);
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Helper function to get token, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
    const token = user.getSignedJwtToken();

    const options = {
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        httpOnly: true
    };

    if (process.env.NODE_ENV === 'production') {
        options.secure = true;
    }

    res
        .status(statusCode)
        .cookie('token', token, options)
        .json({
            success: true,
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                avatar: user.avatar
            }
        });
};

// @desc    Google OAuth login
// @route   POST /api/auth/google
// @access  Public
exports.googleLogin = async (req, res) => {
    try {
        const { credential, access_token, email, name, picture, sub } = req.body;

        let googleId, userEmail, userName, userPicture;

        // Handle access token flow (user info sent from frontend)
        if (access_token && email && sub) {
            googleId = sub;
            userEmail = email;
            userName = name;
            userPicture = picture;
        }
        // Handle ID token flow (credential verification)
        else if (credential) {
            const { OAuth2Client } = require('google-auth-library');
            const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

            const ticket = await client.verifyIdToken({
                idToken: credential,
                audience: process.env.GOOGLE_CLIENT_ID
            });

            const payload = ticket.getPayload();
            googleId = payload.sub;
            userEmail = payload.email;
            userName = payload.name;
            userPicture = payload.picture;
        } else {
            return res.status(400).json({
                success: false,
                message: 'Invalid Google credentials'
            });
        }

        // Check if user already exists with this Google ID
        let user = await User.findOne({ googleId });

        if (user) {
            return sendTokenResponse(user, 200, res);
        }

        // Check if user exists with same email
        user = await User.findOne({ email: userEmail });

        if (user) {
            // Link Google account to existing user
            user.googleId = googleId;
            if (!user.avatar && userPicture) {
                user.avatar = userPicture;
            }
            await user.save();
            return sendTokenResponse(user, 200, res);
        }

        // Create new user
        user = await User.create({
            name: userName,
            email: userEmail,
            googleId,
            authProvider: 'google',
            avatar: userPicture || ''
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error('Google login error:', error);
        res.status(500).json({
            success: false,
            message: 'Google authentication failed'
        });
    }
};

// @desc    Facebook OAuth login
// @route   POST /api/auth/facebook
// @access  Public
exports.facebookLogin = async (req, res) => {
    try {
        const { accessToken, userID } = req.body;

        // Verify Facebook token by fetching user data
        const fetch = (await import('node-fetch')).default;
        const fbResponse = await fetch(
            `https://graph.facebook.com/${userID}?fields=id,name,email,picture&access_token=${accessToken}`
        );

        const fbData = await fbResponse.json();

        if (fbData.error) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Facebook credentials'
            });
        }

        const { id: facebookId, name, email, picture } = fbData;
        const avatar = picture?.data?.url || '';

        // Check if user already exists with this Facebook ID
        let user = await User.findOne({ facebookId });

        if (user) {
            return sendTokenResponse(user, 200, res);
        }

        // Check if user exists with same email
        if (email) {
            user = await User.findOne({ email });

            if (user) {
                // Link Facebook account to existing user
                user.facebookId = facebookId;
                if (!user.avatar && avatar) {
                    user.avatar = avatar;
                }
                await user.save();
                return sendTokenResponse(user, 200, res);
            }
        }

        // Create new user
        const userEmail = email || `${facebookId}@facebook.placeholder.com`;

        user = await User.create({
            name,
            email: userEmail,
            facebookId,
            authProvider: 'facebook',
            avatar
        });

        sendTokenResponse(user, 201, res);
    } catch (error) {
        console.error('Facebook login error:', error);
        res.status(500).json({
            success: false,
            message: 'Facebook authentication failed'
        });
    }
};

