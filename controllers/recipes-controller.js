const mongooseUniqueValidator = require('mongoose-unique-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const Recipe = require('../models/recipe');
const User = require('../models/user');

let RECIPES = [
    {
    id: '1',
    user_id: "blake",
    name: "Spaghetti Carbonara",
    ingredients: [
        { ingredient: "eggs", quantity: "3", optional: false },
        { ingredient: "parmesan cheese", quantity: "50g", optional: false },
        { ingredient: "pancetta", quantity: "150g", optional: false },
        { ingredient: "spaghetti", quantity: "200g", optional: false },
        { ingredient: "olive oil", quantity: "1tbsp", optional: false },
    ],
    method: "Put the egg yolks into a bowl, finely grate in the Parmesan, season with pepper, then mix well with a fork and put to one side. Cut any hard skin off the pancetta and set aside, then chop the meat. Cook the spaghetti in a large pan of boiling salted water until al dente. Meanwhile, rub the pancetta skin, if you have any, all over the base of a medium frying pan (this will add fantastic flavour, or use 1 tablespoon of oil instead), then place over a medium-high heat. Peel the garlic, then crush with the palm of your hand, add it to the pan and leave it to flavour the fat for 1 minute. Stir in the pancetta, then cook for 4 minutes, or until it starts to crisp up. Pick out and discard the garlic from the pan, then, reserving some of the cooking water, drain and add the spaghetti. Toss well over the heat so it really soaks up all that lovely flavour, then remove the pan from the heat. Add a splash of the cooking water and toss well, season with pepper, then pour in the egg mixture – the pan will help to cook the egg gently, rather than scrambling it. Toss well, adding more cooking water until it’s lovely and glossy. Serve with a grating of Parmesan and an extra twist of pepper.",
    portions: '2'
    },
    {
        id: '2',
        user_id: "blake",
        name: "Spaghetti al pomodoro",
        ingredients: [
            { ingredient: "carrot", quantity: "1", optional: false },
            { ingredient: "celery", quantity: "1 stick", optional: false },
            { ingredient: "onion", quantity: "1", optional: false },
            { ingredient: "extra-virgin olive oil", quantity: "4tbsp", optional: false },
            { ingredient: "garlic", quantity: "2 cloves", optional: false },
            { ingredient: "chili flakes", quantity: "1tsp", optional: true },
            { ingredient: "whole plum tomatoes", quantity: "800g", optional: false },
            { ingredient: "spaghetti", quantity: "400g", optional: false },
            { ingredient: "basil", quantity: "2 sprigs", optional: false },
        ],
        method: "Chop the carrot, celery and onion into very small cubes (a food processor is the easiest way to do this, but be careful not to reduce it to a mush – to avoid this, start with the carrot, then add the celery and onion once it’s roughly chopped). Heat the oil in a wide, deep, heavy-based pan (it needs to be big enough to hold the pasta, too) over a medium flame, then saute the vegetables until soft, but not brown. Stir in the garlic and chilli, if using, and cook for another minute or so. Roughly mash, chop or squish the tomatoes into the pan along with their juice and the basil, and bring to a simmer. Turn down the heat until only the odd bubble rises to the surface, and cook for about 40 minutes, until thick. Turn off the heat, remove the basil and discard, then whizz with a stick blender until smooth, bearing in mind it will be hot. Season to taste and bring back to a simmer. Cook the pasta in a large pan of boiling salted water for about six minutes, until bendy, but still chalky in the middle. Drain well, reserving a cup of the cooking water, and transfer to the pureed sauce. Stir in and cook for another six to eight minutes, or until done to your liking, tossing regularly to make sure it doesn’t stick and adding a splash of the reserved cooking water if the sauce gets too thick. Divide between bowls and serve with a dash of extra oil, a scattering of basil leaves and some grated cheese.",
        portions: '4'
    }
]

const getRecipeById = async (req, res, next) => {
    const recipeId = req.params.rid;

    let recipe;
    try {
        recipe = await Recipe.findById(recipeId);
    } catch(err) {
        const error = new HttpError(
            'Something went wrong, could not find a place.', 500
        );
        return next(error);
    }

    if (!recipe) {
        const error = new HttpError('Could not find a recipe for the provided id.')
        return next(error);
    }

    res.json({ recipe: recipe.toObject( {getters: true}) });
};

const getRecipesByUserId = async (req, res, next) => {
    const userId = req.params.uid;
    let recipes;

    try {
        recipes = await Recipe.find({ user_id: userId });
    } catch {
        const error = new HttpError(
            'Fetching places failed, please try again later', 500
        );
    }

    if (!recipes || recipes.length < 1) {
        return next(
            new HttpError('Could not find any recipes for the provided user id.', 404)
        );
    }

    res.json({ recipes: recipes.map(recipe => recipe.toObject({ getters: true })) });
};

const createRecipe = async (req, res, next) => {
    const { user_id, name, description, method, portions } = req.body;
    const createdRecipe = new Recipe ({
        name,
        description,
        method,
        portions,
        user_id
    })
    
    let user;

    try {
        user = await User.findById(user_id);
    } catch (err) {
        const error = new HttpError(
            'Creating recipe failed, please try again',
            500
        );
    }

    if (!user) {
        const error = new HttpError('Could not find user for provided id',
        404);
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        createdRecipe.save({ session: session });
        user.recipes.push(createdRecipe);
        await user.save({ session: session});
        await session.commitTransaction();
    } catch (err) {
        const error = new HttpError(
            'Creating recipe failed, please try again.',
            500
        );
        return next(error);
    }
    
    res.status(201).json({recipe: createdRecipe});
};

const updateRecipe = async (req, res, next) => {
    const { name, description, method, portions } = req.body;
    const recipeId = req.params.rid;

    let recipe;
    try {
        recipe = await Recipe.findById(recipeId);
    } catch(err) {
        const error = new HttpError(
            'Something went wrong, could not update recipe.',
            500
        );
        return next(error);
    }

    recipe.name = name;
    recipe.description = description;
    recipe.method = method;
    recipe.portions = portions;

    try {
        await recipe.save();
    } catch(err) {
        const error = new HttpError(
            'Something went wrong, could not update recipe.',
            500
        );
        return next(error);
    }

    res.status(200).json({recipe: recipe.toObject({ getters: true }) });
}

const deleteRecipe = async (req, res, next) => {
    const recipeId = req.params.rid;
    let recipe;

    try {
        recipe = await Recipe.findById(recipeId).populate('user_id');
    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete recipe.',
            500
        );
        return next(error);
    }
    
    if (!recipe) {
        const error = new HttpError( 
            'Could not find recipe',
            500
        );
        return next(error);
    }

    try {
        const session = await mongoose.startSession();
        session.startTransaction();
        await recipe.remove({session: session});
        recipe.user_id.recipes.pull(recipe);
        await recipe.user_id.save({session: session});
        await session.commitTransaction();

    } catch (err) {
        const error = new HttpError(
            'Something went wrong, could not delete recipe.',
            500
        );
        return next(error);
    }

    res.status(200).json({message: 'Deleted place.'})
}

exports.getRecipeById = getRecipeById;
exports.getRecipesByUserId = getRecipesByUserId;
exports.createRecipe = createRecipe;
exports.updateRecipe = updateRecipe;
exports.deleteRecipe = deleteRecipe;