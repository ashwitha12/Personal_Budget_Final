const model = require('../models/user');
const itemModel = require('../models/item');

exports.new = (req, res) => {
    res.render('./user/new');
};

exports.create = (req, res, next) => {
    let user = new model(req.body);
    user.save()
        .then(user => res.redirect('/users/login'))
        .catch(err => {
            if (err.name === 'ValidationError') {
                req.flash('error', err.message);
                return res.redirect('/users/new');
            }

            if (err.code === 11000) {
                req.flash('error', 'Email has been used');
                return res.redirect('/users/new');
            }

            next(err);
        });
};

exports.getUserLogin = (req, res) => {
    return res.render('./user/login');
};

exports.login = (req, res, next) => {
    let email = req.body.email;
    let password = req.body.password;
    model.findOne({ email: email })
        .then(user => {
            if (!user) {
                req.flash('error', 'wrong email address');
                return res.redirect('/users/login');
            } else {
                user.comparePassword(password)
                    .then(result => {
                        if (result) {
                            req.session.user = user._id;
                            req.flash('success', 'You have successfully logged in');
                            return res.redirect('/users/profile');
                        } else {
                            req.flash('error', 'wrong password');
                            return res.redirect('/users/login');
                        }
                    });
            }
        })
        .catch(err => next(err));
};

exports.profile = (req, res, next) => {
    let id = req.session.user;
    Promise.all([itemModel.find({ user: id })])
        .then(categories => {
            res.render('./user/profile', { categories });
        })
        .catch(err => next(err));
};

exports.getExpenseForm = (req, res, next) => {
    let id = req.session.user;
    itemModel.find({ user: id })
        .then(categories => {
            let categoryNamesList = categories.map(category => category.name);
            const categoryNamesSet = new Set(categoryNamesList);
            categoryNamesList = Array.from(categoryNamesSet);
            res.render('./newExpense', { categoryNamesList });
        })
        .catch(error => {
            console.error('Error retrieving categories:', error);
            res.status(500).send('Internal Server Error.');
        });
};

exports.postExpense = (req, res, next) => {
    let expenses = req.body;
    let id = req.session.user;
    if (!Array.isArray(expenses.categoryName)){
        expenses.categoryName = [expenses.categoryName];
        expenses.amount = [expenses.amount];
        expenses.month = [expenses.month];
    }
    for (let i = 0; i < expenses.categoryName.length; i++) {
        const categoryName = expenses.categoryName[i];
        const amount = expenses.amount[i];
        const month = expenses.month[i];

        itemModel.findOne({ user: id, name: categoryName, month: month })
            .then(category => {
                if (!category) {
                    throw new Error(`Category not found: ${categoryName}`);
                }
                return itemModel.updateOne({ name: categoryName }, { $inc: { expense: amount } });
            })
            .then(() => {
                console.log(`Expenses updated successfully for category: ${categoryName}`);
            })
            .catch(error => {
                console.error(`Error updating expenses for category ${categoryName}:`, error);
            });
    }
    res.redirect('/users/profile');
};

exports.logout = (req, res, next) => {
    req.session.destroy(err => {
        if (err)
            return next(err);
        else
            res.redirect('/');
    });
};
