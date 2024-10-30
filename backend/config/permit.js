const { Permit } = require("permitio");
require("dotenv").config();

const permit = new Permit({
    token: process.env.PERMIT_API_KEY,
    pdp: "http://localhost:7766",
    debug: true,  // Enable debug mode
    log: {
        level: "debug"
    }
});

module.exports = permit;