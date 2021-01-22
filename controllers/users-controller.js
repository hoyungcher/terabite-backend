const HttpError = require('../models/http-error');
const recipe = require('../models/recipe');
const User = require('../models/user');

const getUsers = async (req, res, next) => {
    let users;
    try {
        users = await User.find({}, '-password');
    } catch(err) {
        const error = new HttpError(
            'Fetching users failed, please try again later.',
            500
        );
        return next(error);
    }
    res.json({users: users.map(user => user.toObject({ getters: true }) )});
};

const signup = async (req, res, next) => {
    const { username, first_name, last_name, email, password } = req.body;


    let existingEmail;
    try {
        existingEmail = await User.findOne({ email: email })
    } catch(err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
            );
            return next(error);
    }
        
    let existingUser;
    try {
        existingUser = await User.findOne({ username: username })
    } catch(err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
        );
        return next(error);
    }

    if (existingEmail) {
        const error = new HttpError(
            'User exists already, please login instead.',
            422
        );
        return next(error);
    } 

    if (existingUser) {
        const error = new HttpError(
            'Username already taken, please choose another one.',
            422
        );
        return next(error);
    }

    const createdUser = new User({
        username,
        first_name,
        last_name,
        email,
        password,
        recipes: []
    })

    try {
        await createdUser.save();
    } catch(err) {
        const error = new HttpError(
            'Signing up failed, please try again.',
            500
        );
        return next(error);
    }

    res.status(201).json({ user: createdUser.toObject({ getters: true }) });
};

const login = async (req, res, next) => {
    const { username, password } = req.body;

    let existingUser;
    try {
        existingUser = await User.findOne({ username: username })
    } catch(err) {
        const error = new HttpError(
            'Logging in failed, please try again later.',
            500
        );
        return next(error);
    }

    if (!existingUser || existingUser.password !== password) {
        const error = new HttpError(
            'Invalid credentials. Could not log you in.'
        )
    }
    res.json({message: 'Logged in'})
};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;