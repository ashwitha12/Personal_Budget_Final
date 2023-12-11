exports.validateId = (req, res, next) => {
    let id = req.params.id;
    if (!id.match(/^[0-9a-fA-F]{24}$/)) {
        let error = new Error('Invalid trade ID');
        error.status = 400;
        return next(error);
    } else {
        return next();
    }
};
