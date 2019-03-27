import Organization from '../models/Organization';

const createOrganization = async (req, res, next) => {
  const {
    abbreviation,
    name,
    slackAppWebhook,
    slackChannelId,
    slackTeamId,
    twilioAccountPhoneNumber,
    twilioAuthToken,
    twilioSid,
  } = req.body;

  const attrs = {
    abbreviation,
    name,
    slackAppWebhook,
    slackChannelId,
    slackTeamId,
    twilioAccountPhoneNumber,
    twilioAuthToken,
    twilioSid,
  };

  try {
    await Organization.create(attrs);
    next();
  } catch (err) {
    console.error(err);
    next();
  }

  next();
};

const findOrganization = async (req, res, next) => {
  const { id } = req.body;
  const attrs = { id };

  try {
    res.data = await Organization.findById(attrs)
    next();
  } catch(err) {
    console.error(err);
    next();
  }
};

const getAllOrganizations = async (req, res, next) => {
  try {
    res.data = await Organization.all();
    next();
  } catch (err) {
    console.error(err);
    next();
  }
};

module.exports = (app, urlencodedParser) => {
  app.post(
    '/organizations/create',
    urlencodedParser,
    createOrganization,
    (req, res) => {
      res.status(201).end();
    }
  );

  app.post(
    '/organizations/show',
    urlencodedParser,
    findOrganization,
    (req, res) => {
      res.send(res.data);
    }
  );

  app.post(
    '/organizations/index',
    urlencodedParser,
    getAllOrganizations,
    (req, res) => {
      res.send(res.data);
    }
  );
};
