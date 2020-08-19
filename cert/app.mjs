import * as fs from "fs";
import { createServer } from "https";
import * as devcert from "devcert";

const {
  certificateFor,
  hasCertificateFor,
  configuredDomains,
} = devcert.default;

/**
 * Gets the certificates for the provided domain.
 * Note: may ask for root password if creating root CA
 * https://github.com/davewasmer/devcert#how-it-works
 * @param domain - the domain to get/create the certificates for
 */
async function getCertificate(domain) {
  try {
    return await certificateFor(domain);
  } catch (err) {
    console.error(`Error calling certificateFor with ${domain}`);
    throw new Error(err);
  }
}

/**
 * Write the certificates to specified files.
 * @param domain - the domain tied to the root CA
 * @param keyFileName - The name of the keyfile (e.g., localhost.key)
 * @param certFileName - The name of the certificate file (e.g., localhost.cert)
 */
async function writeCertificatesToDirectory(domain, keyFileName, certFileName) {
  try {
    const cert = await getCertificate(domain).then((cached) => {
      const { cert, key } = cached;
      fs.writeFileSync(certFileName, cert.toString("utf8"));
      fs.writeFileSync(keyFileName, key.toString("utf8"));
    });
  } catch (err) {
    console.error("Error writing certificates");
    throw new Error(err);
  }
}

/**
 * Test the generated certificates on a local server.
 * @param domain - the domain tied to the root CA
 * @param keyFileName - The name of the keyfile (e.g., localhost.key)
 * @param certFileName - The name of the certificate file (e.g., localhost.cert)
 */
const testCerts = (domain, keyFileName, certFileName) => {
  const options = {
    key: fs.readFileSync(keyFileName),
    cert: fs.readFileSync(certFileName),
  };
  console.log(`Checking on https://${domain}:8000`);
  createServer(options, (req, res) => {
    res.writeHead(200);
    res.end("hello world\n");
  }).listen(8000);
};

const [node, file, command, domain, keyFileName, certFileName] = process.argv;

/**
 * Usage:
 *
 * Check configured domains
 * > node app.mjs checkdomain localhost
 *
 * Get cached certificates for a domain and save them to a file:
 * > node app.mjs getdevcerts localhost localhost.key localhost.cert
 *
 * test certificates:
 * > node app.mjs testcerts localhost localhost.key localhost.cert
 */
if (command == "checkdomain") {
  console.log(`configured domains are: ${configuredDomains()}`);
} else if (command == "getdevcerts") {
  const cert = writeCertificatesToDirectory(domain, keyFileName, certFileName)
    .then(() => {
      console.log(`Saved dev certs to ${keyFileName} and ${certFileName}`);
    })
    .catch((e) => {
      console.log("Error getting certificates");
      console.error(e);
    });
} else if (command == "testcerts") {
  testCerts(domain, keyFileName, certFileName);
}
