const BrowserClientInbound = require("../services/BrowserClientInbound");
const SlackInbound = require("../services/SlackInbound");
const SlackOutbound = require("../services/SlackOutbound");
const SmsInbound = require("../services/SmsInbound");
const Organization = require("../models/Organization");

const slackRelay = function(req, _, next) {
  const { channel_id } = req.body;

  Organization.findByVal({
    field: "slackChannelId",
    val: channel_id
  })
    .then(function(organization) {
      if (organization) {
        req.organization = organization;
        SlackInbound.processMessage(req);
        req.chasms = { acknowledge: true };
        next();
      } else {
        req.chasms = { status: 403 };
        next();
      }
    })
    .catch(function(err) {
      req.chasms = { status: 500 };
      console.error("chasms > slackRelay: ", err);
      next();
    });

  const browserClientRelay = function(req, _, next) {
    const { organizationId } = req;

    Organization.findByVal({
      field: "id",
      val: organizationId
    })
      .then(function(organization) {
        if (organization) {
          req.organization = organization;
          BrowserClientInbound.processMessage(req);
          req.chasms = { acknowledge: true };
          next();
        } else {
          req.chasms = { status: 403 };
          next();
        }
      })
      .catch(function(err) {
        req.chasms = { status: 500 };
        console.error("chasms > browserClientRelay: ", err);
        next();
      });
  };

  const smsRelay = function(req, _, next) {
    const { AccountSid } = req.body;

    const organization = Organization.findByVal({
      field: "twilioSid",
      val: AccountSid
    })
      .then(function(organization) {
        if (organization) {
          req.organization = organization;
          SmsInbound.processMessage(req).then(function(chasms) {
            req.chasms = chasms;
            SlackOutbound.sendPublicMessage(req);
            next();
          });
        } else {
          req.chasms = { status: 403 };
          next();
        }
      })
      .catch(function(err) {
        req.chasms = { status: 403 };
        console.error("chasms > smsRelay: ", err);
        next();
      });
  };
};

module.exports = { slackRelay, smsRelay, browserClientRelay };
