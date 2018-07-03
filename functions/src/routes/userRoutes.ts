import User from '../models/User';

const createUser = async (req, res, next) => {
  const {
    chatUsername, email, firstName, lastName, smsNumber, username
  } = req.body;

  const attrs = {
    chatUsername, email, firstName, lastName, smsNumber, username,
  };

  try {
    await User.create(attrs);
    next();
  } catch (err) {
    console.error(err);
    next();
  }

  next();
};

const findUser = async (req, res, next) => {
  const { field, val } = req.body;
  const attrs = { field, val };

  try {
    res.data = await User.findByVal(attrs)
    next();
  } catch(err) {
    console.error(err);
    next();
  }
};

const getAllUsers = async (req, res, next) => {
  try {
    res.data = await User.all({ organizationId: 'x' });
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
