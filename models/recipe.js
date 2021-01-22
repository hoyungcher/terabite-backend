const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const recipeSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    method: { type: String, required: true },
    portions: { type: String, required: true },
    user_id: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
    // ingredients: [{
    //     ingredient: { type: String },
    //     quantity: { type: String },
    //     optional: { type: Boolean }
    // }]
});

module.exports = mongoose.model('Recipe', recipeSchema);