"use strict";
const { body, validationResult } = require('express-validator');

module.exports  = {
    validate (values = []) {
        return async (req, res, next) => {
            await Promise.all(values.map(value => value.run(req)));

            const errors = validationResult(req);

            if (errors.isEmpty()) {
                return next();
            }

            res.status(203).json({ errors: errors.array(), data: false });
        };
    }
}


