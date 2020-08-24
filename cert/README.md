# Development Certificates

## Requirements

Users should be familiar with SSL and trust stores as well as risks associated with self-signed certificates and bypassing browser settings before continuing. **Proceed at your own risk.**

---

There are several ways to use SSL for local development if you need to. Perhaps you need to test on an https connection or want to avoid the browser warnings (Chrome will entirely block a website serving https signed from untrusted certificate authorities)

There are a few strategies:

1.) Generate a root CA and use that to self-sign certificates. You can do this with tools like [Devcert](https://github.com/davewasmer/devcert) or [MakeCert](https://github.com/FiloSottile/mkcert).

2.) Generate self-signed certificates and manually add them to your local trust store.

3.) Generate self-signed certificates and launch chrome with the `chrome://flags/#allow-insecure-localhost` flag.

4.) Generate self-signed certificate and start chrome with the `--ignore-certificate-errors-spki-list=$FINGERPRINT` flag passing the fingerprint of your certificate as [outlined in this excellent blog post](https://httptoolkit.tech/blog/debugging-https-without-global-root-ca-certs#how-could-this-work-better).

Note that all of these approaches have tradeoffs and users should know the risks before continuing. This guide is not meant to be comprehensive. There is an [excellent Stack Overflow post describing these different approaches](https://stackoverflow.com/questions/7580508/getting-chrome-to-accept-self-signed-localhost-certificate).

## Using Devcert for Signing Certificates

The rest of these docs will concern using Devcert because this is the approach the author used. 

[Devcert](https://github.com/davewasmer/devcert) provides tooling for generating certificates signed by a self-signed certificate authority (CA). It also attempts to add them to local trust stores. Users [should be aware of security concerns](https://github.com/davewasmer/devcert#security-concerns) and only use for local development.

This documentation here describes how to use the utility script `app.mjs` to generate trusted self-signed certificates for local development.

# Usage

## Generate a Certificates for `localhost`

The following code will check to see if there are cached certificates for `localhost`. If there are, they will write them to the filenames of your choice. If they are not, devcert will create a self-generated certificate authority and then generate self-signed certificates.

```bash
> node app.mjs getdevcerts localhost localhost.key localhost.cert
```

## Test Generated Certificates

The following code launches a quick server to test the generated certificates. Launching the URL in a browser should produce no warnings or errors.

```bash
> node app.mjs testcerts localhost localhost.key localhost.cert
```
