const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {

    console.log('GET Request')
    res.json({message: 'Shopping List'})
})

module.exports = router;