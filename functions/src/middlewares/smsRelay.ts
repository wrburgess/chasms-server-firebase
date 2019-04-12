import SmsInbound from '../services/SmsInbound';
import Organization from '../models/Organization';

const smsRelay = async (req, _, next) => {
  try {
    const { AccountSid, To } = req.body;
    const organization: any = await Organization.findByVal({
      field: 'twilioSid',
      val: AccountSid,
    });

    if (organization && organization.channels[To]) {
      req.chasms = await SmsInbound.processRequest({ req: req.body, organization });
      next();
    } else {
      const errorMessage: string = 'Invalid account or channel';
      console.error('chasms > smsRelay: ', errorMessage);
      req.chasms = { status: 403, errorMessage };
      next();
    }
  } catch (err) {
    req.chasms = { status: 403 };
    console.error('chasms > smsRelay: ', err);
    next();
  }
};

export default smsRelay;
