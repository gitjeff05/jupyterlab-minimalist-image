# Development Certificates

## Requirements

Users should be familiar with SSL and trust stores as well as risks associated with self-signed certificates before continuing. **Proceed at your own risk.**

---

There are several ways to use SSL for local development. Perhaps you need to test on an https connection or want to avoid browser warnings (Chrome will block sites served over https signed by untrusted CAs).

Some strategies:

1. Generate a root CA and use it to sign certificates — recommended, see below
2. Generate self-signed certificates and manually add them to your local trust store
3. Launch Chrome with `chrome://flags/#allow-insecure-localhost`

## Using mkcert

[mkcert](https://github.com/FiloSottile/mkcert) is a simple, zero-config tool for generating locally-trusted certificates. It creates a local CA and installs it into your system trust stores automatically.

### Install

```bash
# macOS
brew install mkcert

# Linux
apt install mkcert
```

### Setup (once)

```bash
mkcert -install
```

This creates a local CA and registers it with your system trust stores.

### Generate certificates for localhost

```bash
cd cert/
mkcert localhost
```

This produces two files: `localhost.pem` (certificate) and `localhost-key.pem` (key).

### Use with JupyterLab

```bash
docker run --rm -it -p 8888:8888 \
  -w /home/jordan/work \
  -v /path/to/project:/home/jordan/work \
  -v /path/to/cert:/home/jordan/certs \
  jupyterlab-minimalist:latest \
  --ip=0.0.0.0 --port=8888 \
  --certfile=/home/jordan/certs/localhost.pem \
  --keyfile=/home/jordan/certs/localhost-key.pem
```

### Test

Open `https://localhost:8888` in your browser. No certificate warnings should appear.
