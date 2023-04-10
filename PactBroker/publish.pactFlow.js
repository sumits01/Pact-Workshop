const pact = require("@pact-foundation/pact-node");
const path = require("path");

let pactBrokerUrl =
  process.env.PACT_BROKER_URL || "https://sumit.pactflow.io";

const gitHash =
  require("child_process")
    .execSync("git rev-parse --short HEAD")
    .toString()
    .trim() + Math.floor(Date.now() / 1000);

const opts = {
  pactFilesOrDirs: [path.resolve(__dirname, "../pacts/")],
  pactBroker: pactBrokerUrl,
  pactBrokerToken: "FTA7sO4oQ1WRIvzloM3EKA",
  tags: ["prod", "test"],
  consumerVersion: gitHash,
};

pact
  .publishPacts(opts)
  .then(() => {
    console.log("Pact contract publishing complete!");
    console.log("");
    console.log(`Head over to ${pactBrokerUrl} and login with`);
    console.log("to see your published contracts.");
  })
  .catch((e) => {
    console.log("Pact contract publishing failed: ", e);
  });
