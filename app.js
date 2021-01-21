const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const recipesRoutes = require('./routes/recipes-routes');
const inventoryRoutes = require('./routes/inventory-routes');
const mealsRoutes = require('./routes/meals-routes');
const shoppingListRoutes = require('./routes/shopping-list-routes');
const usersRoutes = require('./routes/users-routes');

const HttpError = require('./models/http-error');

const app = express();

app.use(bodyParser.json());

app.use('/api/users', usersRoutes);

app.use('/api/recipes', recipesRoutes);

app.use('/api/inventory', inventoryRoutes);

app.use('/api/meals', mealsRoutes);

app.use('/api/shopping_list', shoppingListRoutes);

app.use((req, res, next) => {
    const error = new HttpError('Could not find this route', 404);
    throw error;
});

app.use((error, req, res, next) => {
 if (res.headerSent) {
     return next(error);
 }
    res.status(error.code || 500);
    res.json({message: error.message || 'An unknown error occurred!'});

});

mongoose
    .connect('mongodb+srv://hoyungcher:terabite123@cluster0.kyz9t.mongodb.net/test?retryWrites=true&w=majority')
    .then(() => {
        app.listen(5000);
    })
    .catch(err => {
        console.log(err);
    });
