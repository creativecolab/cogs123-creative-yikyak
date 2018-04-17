import { Meteor } from "meteor/meteor";
import "../imports/api/responses.js";
import "../imports/api/messages.js";

Meteor.startup(() => {
  // code to run on server at startup
});

ServiceConfiguration.configurations.remove({
  service: "facebook"
});

ServiceConfiguration.configurations.insert({
  service: "facebook",
  appId: "1013029228852160"
});
