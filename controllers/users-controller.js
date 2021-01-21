const HttpError = require('../models/http-error');
const recipe = require('../models/recipe');
const User = require('../models/user');

const getUsers = (req, res, next) => {
    res.status(200).json({users: USERS});
};

const signup = async (req, res, next) => {
    const { username, first_name, last_name, email, password } = req.body;


    let existingEmail;
    try {
        const existingEmail = await User.findOne({ email: email })
    } catch(err) {
        const error = new HttpError(
            'Signing up failed, please try again later.',
            500
            );
            return next(error);
    }
        
    let existingUser;
    try {
        const existingUser = await User.findOne({ username: username })
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
        password
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

const login = (req, res, next) => {
    const { username, password } = req.body;

    const identifiedUser = USERS.find(u => u.username === username);

    if (!identifiedUser || identifiedUser.password !== password) {
        throw new HttpError('Could not identify user, credentials seem to be wrong.', 401)
    }

    res.json({message: 'Logged in'})


};

exports.getUsers = getUsers;
exports.signup = signup;
exports.login = login;