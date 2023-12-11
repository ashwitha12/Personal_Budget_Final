const Trade = require('../models/item');

exports.isGuest = (req, res, next) => {
    if (!req.session.user) {
        return next();
    } else {
        req.flash('error', 'You are logged in already');
        return res.redirect('/users/profile');
    }
};

exports.isLoggedIn = (req, res, next) => {
    if (req.session.user) {
        return next();
    } else {
        req.flash('error', 'You need to log in first');
        return res.redirect('/users/login');
    }
};

exports.isVendor = (req, res, next) => {
    let id = req.params.id;
    Trade.findById(id)
        .then(trade => {
            if (trade.vendor == req.session.user) {
                return next();
            } else {
                let err = new Error('Unauthorized to access the resource');
                err.status = 404;
                return next(err);
            }
        })
        .catch(err => next(err));
};
