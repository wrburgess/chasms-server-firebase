import { browserClientRelay } from "../middlewares/chasms";

module.exports = (app, urlencodedParser) => {
  app.post("/message", urlencodedParser, browserClientRelay, (req, res) => {
    if (req.chasms.acknowledge) {
      res.json({ response_type: "in_channel" });
    } else if (req.chasms.status < 400) {
      res.json(req.chasms.chatResponse);
    } else {
      res.json(req.chasms.status);
    }
  });
};
