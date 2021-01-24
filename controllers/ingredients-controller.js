const HttpError = require('../models/http-error');
const Ingredient = require('../models/ingredient');

const createIngredient = async (req, res, next) => {
   const { name } = req.body;

    let existingIngredient;
    try {
        existingIngredient = await Ingredient.findOne({name: name});
    } catch (err) {
        const error = new HttpError(
            'Could not add ingredient. Please try again later.',
            500
        );
        return next(error);
    }

    if (existingIngredient) {
        const error = new HttpError(
            'Ingredient exists already.',
            422
        );
        return next(error);
    }

    const createdIngredient = new Ingredient({
        name
    });

    try {
        await createdIngredient.save();
    } catch(err) {
        const error = new HttpError(
            'Signing up failed, please try again.',
            500
        );
        return next(error);
    }
    res.status(201).json({ ingredient: createdIngredient.toObject({ getters: true }) });
}

exports.createIngredient = createIngredient;