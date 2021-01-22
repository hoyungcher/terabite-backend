const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const userSchema = new Schema({
    first_name: { type: String, required: true },
    last_name: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, minlength: 6 },
    recipes: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Recipe' }]
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);