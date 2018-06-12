const User = require('../models/User');
const createUser = (req, res, next) => {
    const { chatUsername, email, firstName, lastName, smsNumber, username } = req.body;
    const attrs = {
        chatUsername,
        email,
        firstName,
        lastName,
        smsNumber,
        username,
    };
    User.create(attrs);
    next();
};
module.exports = (app, urlencodedParser) => {
    app.post('/createUser', urlencodedParser, createUser, (req, res) => {
        res.status(201);
    });
};
//# sourceMappingURL=userRoutes.js.map