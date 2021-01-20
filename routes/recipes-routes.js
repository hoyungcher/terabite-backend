const express = require('express');

const recipesController = require('../controllers/recipes-controller');

const router = express.Router();



router.get('/user/:uid', recipesController.getRecipesByUserId);

router.get('/:rid', recipesController.getRecipeById);

router.post('/', recipesController.createRecipe);

router.patch('/:rid', recipesController.updateRecipe);

router.delete('/:rid', recipesController.deleteRecipe);

module.exports = router;