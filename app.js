const express = require('express');
const bodyParser = require('body-parser');

const recipesRoutes = require('./routes/recipes-routes');
const inventoryRoutes = require('./routes/inventory-routes');
const mealsRoutes = require('./routes/meals-routes');
const shoppingListRoutes = require('./routes/shopping-list-routes');
const usersRoutes = require('./routes/users-routes');

const app = express();

app.use('/api/recipes', recipesRoutes);

app.use('/api/inventory', inventoryRoutes);

app.use('/api/meals', mealsRoutes);

app.use('/api/shopping_list', shoppingListRoutes);

app.use((error, req, res, next) => {
 if (res.headerSent) {
     return next(error);
 }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});

});

app.listen(5000);