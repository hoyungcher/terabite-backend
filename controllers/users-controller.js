const HttpError = require('../models/http-error');

const USERS = [
    {
        username: 'blake',
        first_name: 'Blake',
        last_name: 'Ho',
        email: 'blake@gmail.com',
        password: 'password',
    },
    {
        username: 'darren',
        first_name: 'Darren',
        last_name: 'Jones',
        email: 'dan@gmail.com',
        password: 'password',
    }
];


const getUsers = (req, res, next) => {
    res.status(200).json({users: USERS});
};

const signup = (req, res, next) => {
    const { username, first_name, last_name, email, password } = req.body;

    const hasEmail = USERS.find(u => u.email === email);
    if (hasEmail) {
        throw new HttpError('Email already in use. Please login.', 422);
    }

    const hasUsername = USERS.find(u => u.username === username);
    if (hasUsername) {
        throw new HttpError('Username already in use. Please choose a different username.', 422);
    }

    const createdUser = {
        username,
        first_name,
        last_name,
        email,
        password
    }

    USERS.push(createdUser);

    res.status(201).json({user: createdUser});
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