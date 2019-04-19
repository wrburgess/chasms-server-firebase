import SmsInbound from '../services/SmsInbound';
import Organization from '../models/Organization';

const smsRelay = async (req, _, next) => {
  try {
    const { To } = req.body;
    const organization: any = await Organization.findByTwilioAccountPhoneNumber(To);

    const channel = Organization.channelFindByVal({
      organization,
      field: 'twilioAccountPhoneNumber',
      val: To,
    });

    if (organization && channel && channel.usesTwilio) {
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
