const model = require('../models/item');

exports.index = (req, res, next) => {
    res.render('trades');
};

exports.new = (req, res) => {
    res.render('./newTrade');
};

exports.create = (req, res, next) => {
    const { categories } = req.body;
    const resultArray = [];
  
    for (let i = 0; i < categories.length; i += 3) {
      const category = categories[i];
      const budget = parseInt(categories[i + 1]);
      const month = categories[i + 2];
      resultArray.push({ name: category, budget, month });
    }
  
    const categoryObjects = resultArray.map(({ name, budget, month }) => ({
      name,
      budget,
      month,
      user: req.session.user,
    }));
  
    Promise.all(
      categoryObjects.map((categoryObj) => {
        return model
          .findOne({
            user: req.session.user,
            name: categoryObj.name,
            month: categoryObj.month,
          })
          .then((existingCategory) => {
            if (existingCategory) {
              existingCategory.budget += categoryObj.budget;
              return existingCategory.save();
            } else {
              return model.create({
                ...categoryObj,
                user: req.session.user,
              });
            }
          });
      })
    )
      .then((savedCategories) => {
        res.redirect('/users/profile');
      })
      .catch((error) => {
        res.status(500).send('Internal Server Error');
      });
};
