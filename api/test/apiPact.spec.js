const { Verifier } = require("@pact-foundation/pact");

const controller = require("../controllers/filmsController");

var path = require("path");

var express = require("express"),
  app = express(),
  port = process.env.PORT || 3000,
  Film = require("../models/filmModel"),
  bodyParser = require("body-parser");

const init = () => {
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.json());

  var routes = require("../routes/filmsRoutes"); //importing route
  routes(app); //register the route
  controller.init_data();
  return app.listen(port, () =>
    console.log(`Provider API listening on port ${port}...`)
  );
};

const server = init();

describe("Pact Verification", () => {
  it("validates the expectations of ProductService", () => {
    let opts = {
      logLevel: "INFO",
      provider: "FilmsProvider",
      providerBaseUrl: "http://localhost:3000",
      pactBrokerUrl: process.env.PACT_BROKER_URL || "https://sumit.pactflow.io/",
      pactBrokerToken: process.env.PACT_BROKER_USERNAME || "FTA7sO4oQ1WRIvzloM3EKA",
      providerVersion: "1.0.0",
      publishVerificationResult: true,
      stateHandlers: {
        "Generate films": () => {
          controller.filmRepository.clear();
          controller.init_data();
        },
        "Clear repo": () => {
          controller.filmRepository.clear();
        },
        "Generate Film 999": () => {
          controller.filmRepository.insert(
            new Film(999, "Film To Delete", "To DELETE", "2020")
          );
        },
      },
    };

    return new Verifier(opts).verifyProvider().finally(() => {
      server.close();
    });
  });
});
