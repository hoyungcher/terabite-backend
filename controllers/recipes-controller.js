const { v4: uuidv4 } = require('uuid');

const HttpError = require('../models/http-error');


const RECIPES = [
    {
    id: '1',
    user_id: "blake",
    name: "Spaghetti Carbonara",
    imageURL: "https://images.immediate.co.uk/production/volatile/sites/30/2020/08/recipe-image-legacy-id-1001491_11-2e0fa5c.jpg?quality=90&webp=true&resize=300,272",
    ingredients: [
        { ingredient: "eggs", quantity: "3", optional: false },
        { ingredient: "parmesan cheese", quantity: "50g", optional: false },
        { ingredient: "pancetta", quantity: "150g", optional: false },
        { ingredient: "spaghetti", quantity: "200g", optional: false },
        { ingredient: "olive oil", quantity: "1tbsp", optional: false },
    ],
    method: "Put the egg yolks into a bowl, finely grate in the Parmesan, season with pepper, then mix well with a fork and put to one side. Cut any hard skin off the pancetta and set aside, then chop the meat. Cook the spaghetti in a large pan of boiling salted water until al dente. Meanwhile, rub the pancetta skin, if you have any, all over the base of a medium frying pan (this will add fantastic flavour, or use 1 tablespoon of oil instead), then place over a medium-high heat. Peel the garlic, then crush with the palm of your hand, add it to the pan and leave it to flavour the fat for 1 minute. Stir in the pancetta, then cook for 4 minutes, or until it starts to crisp up. Pick out and discard the garlic from the pan, then, reserving some of the cooking water, drain and add the spaghetti. Toss well over the heat so it really soaks up all that lovely flavour, then remove the pan from the heat. Add a splash of the cooking water and toss well, season with pepper, then pour in the egg mixture – the pan will help to cook the egg gently, rather than scrambling it. Toss well, adding more cooking water until it’s lovely and glossy. Serve with a grating of Parmesan and an extra twist of pepper.",
    portions: 2
    },
    {
        id: '2',
        user_id: "blake",
        name: "Spaghetti al pomodoro",
        imageURL: "https://i.guim.co.uk/img/media/97b05bf6e971aa1e0033268db1cae3d2c9dd15b4/1069_1632_6614_3968/master/6614.jpg?width=620&quality=85&auto=format&fit=max&s=b310ed608b3643b95026a20631873a81",
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
        portions: 4
    }
]

let next_id = 3;

const getRecipeById = (req, res, next) => {
    const recipeId = req.params.rid;
    const recipe = RECIPES.find(r => {
        return r.id === recipeId;
    });
    
    if (!recipe) {
        throw new HttpError('Could not find a recipe for the provided id.')

    }

    res.json({recipe});
};

const getRecipesByUserId = (req, res, next) => {
    const userId = req.params.uid;
    const recipes = RECIPES.filter(r => {
        return r.user_id === userId;
    })

    if (recipes.length < 1) {
        throw new HttpError('Could not find a recipe for the provided user id.');
    }

    res.json({recipes});
};

const createRecipe = (req, res, next) => {
    const { user_id, name, method, portions } = req.body;
    const createdRecipe = {
        id: uuidv4(),
        user_id,
        name,
        method,
        portions
    }
    RECIPES.push(createdRecipe);

    res.status(201).json({recipe: createdRecipe});
    next_id++;
};

exports.getRecipeById = getRecipeById;
exports.getRecipesByUserId = getRecipesByUserId;
exports.createRecipe = createRecipe;