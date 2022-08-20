var express = require('express');
var router = express.Router();
var moment = require('moment');
const Movie = require('../models/MovieSchema');

const {checkAuth} = require('../config/auth');

// get all movies
router.get('/', checkAuth, function(req, res, next) {
    let ListMovies = [];
    Movie.find(function(err, movies) {
        if(movies){
            for(let data of movies){
                ListMovies.push({
                    id: data._id,
                    name: data.name,
                    released_on: data.released_on,
                })
            }
            res.render('movie/allMovies', {ListMovies})
        } else {
            ListMovies.push({
                id: "",
                name: "",
                released_on: "",
            })
            res.render('movie/allMovies', {ListMovies})
        }
    });
});

// create movies
router.get('/create', checkAuth, function(req, res, next) {
    res.render('movie/createMovies', { title: 'Create Movie Page' });
});

// update movies
router.get('/update/:movieId', checkAuth, function(req, res, next) {
    Movie.findById(req.params.movieId, function(err, movieInfo) {
        var newDate = moment(movieInfo.released_on).format('YYYY-MM-DD');
        if(movieInfo){
            console.log(movieInfo);
            res.render('movie/updateMovies', {
                movies: movieInfo,
                newDate
            });
        }
    })
});

// action create
router.post('/create', checkAuth, function(req, res) {
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
router.post('/update', checkAuth, function(req, res) {
    let errors = [];
    Movie.findByIdAndUpdate(req.body.id, {name: req.body.name, released_on: req.body.date},
        function(err){
            if(err){
                console.log(err);
            } else {
                errors.push({ msg: 'Movie updated successfully' });
                var newMovies = {_id: req.body.id, name: req.body.name};
                var newDate = moment(req.body.date).format('YYYY-MM-DD');
                res.render('movie/updateMovies', {
                    movies: newMovies,
                    newDate,
                    errors
                });
            }
        }
    )
});

// action delete
router.get('/delete/:movieId', checkAuth, function(req, res) {
    Movie.findByIdAndDelete(req.params.movieId, function(){
        res.redirect('/movies');
    })
});

module.exports = router;