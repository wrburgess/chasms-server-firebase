import Contact from '../models/Contact';

const createContact = async (req, res, next) => {
  const { organizationId, chatUsername, email, firstName, lastName, smsNumber, username } = req.body;

  const attrs = {
    organizationId,
    chatUsername,
    email,
    firstName,
    lastName,
    smsNumber,
    username,
  };

  try {
    res.data = await Contact.create(attrs);
    next();
  } catch (err) {
    console.error(err);
    next();
  }

  next();
};

const findContact = async (req, res, next) => {
  const { organizationId, field, val } = req.body;
  const attrs = { organizationId, field, val };

  try {
    res.data = await Contact.findByVal(attrs);
    next();
  } catch (err) {
    console.error(err);
    next();
  }
};

const getAllContacts = async (req, res, next) => {
  const { organizationId } = req.body;
  const attrs = { organizationId };

  try {
    res.data = await Contact.all(attrs);
    next();
  } catch (err) {
    console.error(err);
    next();
  }
};

module.exports = (app, urlencodedParser) => {
  app.post('/contacts/create', urlencodedParser, createContact, (req, res) => {
    res.status(201).end();
  });

  app.post('/contacts/show', urlencodedParser, findContact, (req, res) => {
    res.send(res.data);
  });

  app.post('/contacts/index', urlencodedParser, getAllContacts, (req, res) => {
    res.send(res.data);
  });
};
