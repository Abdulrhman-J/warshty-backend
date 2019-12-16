//Abdulwahhab
// Express docs: http://expressjs.com/en/api.html
const express = require('express')
// Passport docs: http://www.passportjs.org/docs/
const passport = require('passport')

// pull in Mongoose model for customer
const Customer = require('../models/customer')

// this is a collection of methods that help us detect situations when we need
// to throw a custom error
const customErrors = require('../../lib/custom_errors')

// we'll use this function to send 404 when non-existant document is requested
const handle404 = customErrors.handle404
// we'll use this function to send 401 when a user tries to modify a resource
// that's owned by someone else
const requireOwnership = customErrors.requireOwnership

// this is middleware that will remove blank fields from `req.body`, e.g.

const removeBlanks = require('../../lib/remove_blank_fields')
// passing this as a second argument to `router.<verb>` will make it
// so that a token MUST be passed for that route to be available
// it will also set `req.user`
const requireToken = passport.authenticate('bearer', { session: false })

// instantiate a router (mini app that only handles routes)

const router = express.Router()

// SHOW ALL
// GET api/customer/5a7db6c74d55bc51bdf39793
router.get('/api/customer/', requireToken, (req, res, next) => {
    // req.params.id will be set based on the `:id` in the route
    Customer.find()
        .then((customers) => {
            res.status(200).json({ customers: customers })
        })
        .catch((err) => {
            res.status(500).json({ err: err })
        })
});


// SHOW SINGLE
// GET api/customer/5a7db6c74d55bc51bdf39793
router.get('/api/customer/:id', requireToken, (req, res) => {
    // req.params.id will be set based on the `:id` in the route
    Customer.findById(req.params.id)
        .then((customer) => {
            res.status(200).json({ customer: customer })
        })
        .catch((err) => {
            res.status(500).json({ err: err })
        })
});

// CREATE
// POST /customer
router.post('/api/customer', requireToken, (req, res, next) => {
    // set owner of new customer to be current user
    console.log(req.user.id)
    req.body.customer.shop = req.user.id

    Customer.create(req.body.customer)
        // respond to succesful `create` with status 201 and JSON of new "customer"
        .then(customer => {
            res.status(201).json({ newCustomer: customer.toObject() })
        })
        // if an error occurs, pass it off to our error handler
        // the error handler needs the error message and the `res` object so that it
        // can send an error message back to the client
        .catch(next)
});

// UPDATE
// PATCH /customer/5a7db6c74d55bc51bdf39793
router.patch('/api/customer/:id', requireToken, removeBlanks, (req, res, next) => {
    // if the client attempts to change the `owner` property by including a new
    // owner, prevent that by deleting that key/value pair

    delete req.body.customer.shop

    Customer.findById(req.params.id)
        .then(customer => {
            // pass the `req` object and the Mongoose record to `requireOwnership`
            // it will throw an error if the current user isn't the owner
            // requireOwnership(req, customer)
            console.log(customer)

            // pass the result of Mongoose's `.update` to the next `.then`
            return customer.update(req.body.customer)
        })
        // if that succeeded, return 204 and no JSON
        .then(() => res.status(204))
        // if an error occurs, pass it to the handler
        .catch(next)
});




// DESTROY
// DELETE /api/customer/5a7db6c74d55bc51bdf39793
router.delete('/api/customer/:id', requireToken, (req, res, next) => {
    customer.findById(req.params.id)
        .then(customer => {
            if (customer) {
                return customer.remove()
            } else {
                
        // If we couldn't find a user with the matching ID
        res.status(404).json({
            error: {
              name: 'DocumentNotFoundError',
              message: 'The provided ID doesn\'t match any documents'
            }
          });
            }
            // throw an error if current user doesn't own `customer`
            // requireOwnership(req, customer)
            // delete the customer ONLY IF the above didn't throw
            customer.remove()
        })
        // send back 204 and no content if the deletion succeeded
        .then(() => res.sendStatus(204))
        // if an error occurs, pass it to the handler
        .catch(next)
});

module.exports = router
