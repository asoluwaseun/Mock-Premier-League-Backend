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
    },

    register_user: [
        body('firstname').isString(),
        body('lastname').isString(),
        body('email').isEmail().normalizeEmail(),
        body('phone').isMobilePhone('en-NG'),
        body('password').isString()
    ],
    login_user: [
        body('email').isEmail().normalizeEmail(),
        body('password').isString()
    ],
    change_password: [
        body('old_password').isString(),
        body('new_password').isString()
    ],
    add_team: [
        body('fullname').isString(),
        body('shortname').isString(),
        body('founder').isString(),
        body('manager').isString(),
        body('nickname').isString(),
        body('website').optional().isURL()
    ]
}


