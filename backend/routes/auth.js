
import express from 'express';
import User from '../models/User.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Hardcoded JWT Secret as per request
const JWT_SECRET = '4jgorijhg03498uru340uufwefhovowjsjvoj7686gsdgfiw';
const JWT_EXPIRES_IN = '30d';

const generateTokenAndSetCookie = (res, userId) => {
    const token = jwt.sign({ userId }, JWT_SECRET, {
        expiresIn: JWT_EXPIRES_IN,
    });

    res.cookie('jwt', token, {
        httpOnly: true, // Prevents client-side JS from accessing the cookie
        secure: false, // Must be false for local http development. Set to true in production with HTTPS.
        sameSite: 'strict', // Mitigates CSRF attacks
        maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
};

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ message: 'User already exists' });
        }

        const newUser = await User.create({
            name,
            email,
            password,
            avatarUrl: `https://picsum.photos/seed/user_${Date.now()}/200/200`,
            isOnline: true,
        });

        if (newUser) {
            generateTokenAndSetCookie(res, newUser._id);
            res.status(201).json(newUser.toJSON());
        } else {
            res.status(400).json({ message: 'Invalid user data' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during registration' });
    }
});

// @desc    Auth user & get token
// @route   POST /api/auth/login
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (user && (await user.matchPassword(password))) {
            user.isOnline = true;
            await user.save();
            generateTokenAndSetCookie(res, user._id);
            res.json(user.toJSON());
        } else {
            res.status(401).json({ message: 'Invalid email or password' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error during login' });
    }
});

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
router.post('/logout', async (req, res) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            await User.findByIdAndUpdate(decoded.userId, { isOnline: false });
        } catch (error) {
            // Ignore if token is invalid, just clear the cookie
        }
    }
    res.cookie('jwt', '', {
        httpOnly: true,
        expires: new Date(0),
    });
    res.status(200).json({ message: 'Logged out successfully' });
});

// @desc    Get user profile
// @route   GET /api/auth/me
// @access  Private
router.get('/me', async (req, res) => {
    const token = req.cookies.jwt;
    if (token) {
        try {
            const decoded = jwt.verify(token, JWT_SECRET);
            const user = await User.findById(decoded.userId).select('-password');
            if (user) {
                res.json(user);
            } else {
                res.status(404).json({ message: 'User not found' });
            }
        } catch (error) {
            res.status(401).json({ message: 'Not authorized, token failed' });
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' });
    }
});

export default router;
