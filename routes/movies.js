const express = require('express');

var router = express.Router();

var Movie = require('../models/MovieSchema');

// get all movies
router.get('/', function(req, res, next) {
    res.render('movie/allMovies', { title: 'Get Movies Page' });
});

// create movies
router.get('/create', function(req, res, next) {
    res.render('movie/createMovies', { title: 'Create Movie Page' });
});

// update movies
router.get('/update/:movieId', function(req, res, next) {
    res.render('movie/updateMovies', { title: 'Update Movie Page', movieId: req.params.movieId });
});

// action create
router.post('/create', function(req, res) {
    const {name, date} = req.body;

    let errors = [];
    if(!name || !date) {
        errors.push({ msg: 'Please enter all fields' });
    }
    if(errors.length > 0) {
        res.render('movie/createMovies', {errors});
    } else {
        const newMovie = Movie({
            name,
            released_on: date
        });
        newMovie.save()
        .then(movie => {
            errors.push({ msg: 'Movie created successfully' });
            res.render('movie/createMovies', {errors});
        }).catch(err => console.log(err));
    }
})


// action update
router.put('/update/:movieID', function(req, res) {

});

// action delete
router.delete('/delete/:movieID', function(req, res) {

});

module.exports = router;