const express = require('express');

const ingredientsController = require('../controllers/ingredients-controller');

const router = express.Router();

// router.get('/:rid', ingredientsController.searchIngredients);

router.post('/', ingredientsController.createIngredient);

// router.patch('/:rid', ingredientsController.updateIngredient);

// router.delete('/:rid', ingredientsController.deleteIngredient);

module.exports = router;