import validateRequest from '../modules/validateRequest';
import ApiInbound from '../services/ApiInbound';

const apiRelay = async (req, _, next) => {
  try {
    const requestValidity = validateRequest(req);

    if (requestValidity.status) {
      ApiInbound.processMessage(req);
      req.chasms = { status: 200 };
      next();
    } else {
      req.chasms = { status: 403, errors: requestValidity.messages };
      next();
    }
  } catch (err) {
    req.chasms = { status: 500 };
    console.error('chasms > apiRelay: ', err);
    next();
  }
};

export default apiRelay;
