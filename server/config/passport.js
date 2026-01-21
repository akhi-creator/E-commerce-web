const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const FacebookStrategy = require('passport-facebook').Strategy;
const User = require('../models/User');

// Serialize user for session
passport.serializeUser((user, done) => {
    done(null, user.id);
});

// Deserialize user from session
passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

// Google OAuth Strategy
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
    passport.use(new GoogleStrategy({
        clientID: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        callbackURL: '/api/auth/google/callback',
        scope: ['profile', 'email']
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await User.findOne({ googleId: profile.id });

                if (user) {
                    return done(null, user);
                }

                // Check if user exists with same email
                user = await User.findOne({ email: profile.emails[0].value });

                if (user) {
                    // Link Google account to existing user
                    user.googleId = profile.id;
                    user.authProvider = user.authProvider === 'local' ? 'local' : 'google';
                    if (!user.avatar && profile.photos && profile.photos[0]) {
                        user.avatar = profile.photos[0].value;
                    }
                    await user.save();
                    return done(null, user);
                }

                // Create new user
                user = await User.create({
                    name: profile.displayName,
                    email: profile.emails[0].value,
                    googleId: profile.id,
                    authProvider: 'google',
                    avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : ''
                });

                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }));
}

// Facebook OAuth Strategy
if (process.env.FACEBOOK_APP_ID && process.env.FACEBOOK_APP_SECRET) {
    passport.use(new FacebookStrategy({
        clientID: process.env.FACEBOOK_APP_ID,
        clientSecret: process.env.FACEBOOK_APP_SECRET,
        callbackURL: '/api/auth/facebook/callback',
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
        async (accessToken, refreshToken, profile, done) => {
            try {
                // Check if user already exists
                let user = await User.findOne({ facebookId: profile.id });

                if (user) {
                    return done(null, user);
                }

                // Check if user exists with same email (if email is available)
                if (profile.emails && profile.emails[0]) {
                    user = await User.findOne({ email: profile.emails[0].value });

                    if (user) {
                        // Link Facebook account to existing user
                        user.facebookId = profile.id;
                        user.authProvider = user.authProvider === 'local' ? 'local' : 'facebook';
                        if (!user.avatar && profile.photos && profile.photos[0]) {
                            user.avatar = profile.photos[0].value;
                        }
                        await user.save();
                        return done(null, user);
                    }
                }

                // Create new user
                const email = profile.emails && profile.emails[0]
                    ? profile.emails[0].value
                    : `${profile.id}@facebook.placeholder.com`;

                user = await User.create({
                    name: profile.displayName,
                    email: email,
                    facebookId: profile.id,
                    authProvider: 'facebook',
                    avatar: profile.photos && profile.photos[0] ? profile.photos[0].value : ''
                });

                done(null, user);
            } catch (error) {
                done(error, null);
            }
        }));
}

module.exports = passport;
