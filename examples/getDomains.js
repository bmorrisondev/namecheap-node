const { NamecheapClient } = require('../src/main.js')

// Populate your own values here:
const apiUser = ""
const apiKey = ""
const clientIp = ""

let client = new NamecheapClient(apiUser, apiKey, clientIp);

client.getDomains()
  .then(domains => {
    console.log(domains)
  });

// Or using Async

(async () => {
  let domains = await client.getDomains();
  console.log(domains);
})();