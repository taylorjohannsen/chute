// authentication function to check in user is logged in on page load
module.exports = {
    toMainpage: function(req, res, next) {
        if(req.isAuthenticated()) {
            return next();
        }
        res.render('welcome');
    }
}