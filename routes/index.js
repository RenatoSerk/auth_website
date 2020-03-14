var express = require('express');
var router = express.Router();

function checkAuth(req, res, next){ //middleware that prevents accesing front page while not logged in
    if (req.isAuthenticated()){
        return next()
    }

    res.redirect('/login')
}

function checkNotAuth(req, res, next){ //middleware that prevents accessing login page while logged in
    if (req.isAuthenticated()){
       return res.redirect('/')
    }

    return next()
}

module.exports = function(passport){

// Logged in page
router.get('/', checkAuth, (req, res) => {
    res.render('index', {message: req.flash('message')} ) //Front page error's if not logged in!
})

// Hadle log in authentication
router.post('/login', checkNotAuth, passport.authenticate('login', 
    {
        successRedirect: '/',
        failureRedirect: '/login',
        failureFlash: true
    })
)

// Load the login page
router.get('/login', checkNotAuth, (req, res) => {
    res.render('login.ejs')
})

router.get('/register', checkNotAuth, (req, res) => {
    res.render('register.ejs', {message: req.flash('message')} )
})

router.post('/register', checkNotAuth, passport.authenticate('signup', 
    {
        successRedirect: '/home',
        failureRedirect: '/signup',
        failureFlash : true  
    })
)

router.delete('/logout', (req, res) => { //Logout
    req.logOut()
    res.redirect('/login')
})

return router
}