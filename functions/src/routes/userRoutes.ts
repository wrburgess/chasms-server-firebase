import User from '../models/User';

const createUser = async (req, res, next) => {
  const {
    organizationId, chatUsername, email, firstName, lastName, smsNumber, username
  } = req.body;

  const attrs = {
    organizationId, chatUsername, email, firstName, lastName, smsNumber, username,
  };

  try {
    res.data = await User.create(attrs);
    next();
  } catch (err) {
    console.error(err);
    next();
  }

  next();
};

const findUser = async (req, res, next) => {
  const { organizationId, field, val } = req.body;
  const attrs = { organizationId, field, val };

  try {
    res.data = await User.findByVal(attrs)
    next();
  } catch(err) {
    console.error(err);
    next();
  }
};

const getAllUsers = async (req, res, next) => {
  const { organizationId } = req.body;
  const attrs = { organizationId };

  try {
    res.data = await User.all(attrs);
    next();
  } catch (err) {
    console.error(err);
    next();
  }
};

module.exports = (app, urlencodedParser) => {
  app.post(
    '/users/create',
    urlencodedParser,
    createUser,
    (req, res) => {
      res.status(201).end();
    }
  );

  app.post(
    '/users/show',
    urlencodedParser,
    findUser,
    (req, res) => {
      res.send(res.data);
    }
  );

  app.post(
    '/users/index',
    urlencodedParser,
    getAllUsers,
    (req, res) => {
      res.send(res.data);
    }
  );
};
