//Abdulrhman
// Express, Passport, 
const express = require('express');
const passport = require('passport');

// pull in Mongoose model for examples
const Car = require('../models/car');

// See details in example_reoutes.js
const customErrors = require('../../lib/custom_errors');
const handle404 = customErrors.handle404;
const requireOwnership = customErrors.requireOwnership;
const removeBlanks = require('../../lib/remove_blank_fields');
const requireToken = passport.authenticate('bearer', { session: false });

// instantiate a router (mini app that only handles routes)
const router = express.Router();


/**
 * Action:      INDEX
 * Method:      GET
 * URI:         /:id/car
 * Description: Get All Cars and one
 */

router.get('api/car', requireToken, (req, res) => {
    Car.find()
        .then((car) => {
            res.status(200).json({ cars: cars });
        })
        .catch((error) => {
            res.status(500).json({ error: error });
        });
});



/**
 * Action:      CREATE new car
 * Method:      POST
 * URI:         /api/cars
 * Description: Create a new Article
*/
router.post('api/car', requireToken, (req, res, next) => {
    Car.create(req.body.car)

        .then((newCar) => {
            res.status(201).json({ car: newCar });
        })
        // Catch any errors that might occur
        .catch((error) => {
            res.status(500).json({ error: error });
        });
});

/**
 * Action:      DESTROY
 * Method:      DELETE
* URI:          /api/car/:id
* Description: Delete An car by Car ID
 */
router.delete('/api/:id/car/:id', requireToken, (req, res) => {
    Article.findById(req.params.id)
        .then((car) => {
            if (car) {
                // Pass the result of Mongoose's `.delete` method to the next `.then`
                return car.remove();
            } else {
                // If we couldn't find a document with the matching ID
                res.status(404).json({ error: error });
            }
        })
        .then(() => {
            // If the deletion succeeded, return 204 and no JSON
            res.status(204).end();
        })
        // Catch any errors that might occur
        .catch((error) => {
            res.status(500).json({ error: error });
        });
});


module.exports = router;