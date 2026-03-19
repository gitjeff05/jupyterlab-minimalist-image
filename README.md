# Minimalist JupyterLab Docker Image

A [lightweight](https://github.com/gitjeff05/jupyterlab-minimalist-image#results) Docker image for Python, [JupterLab](https://jupyterlab.readthedocs.io), [Numpy](https://numpy.org/), [Pandas](https://pandas.pydata.org/), [Matplotlib](https://matplotlib.org/) and [scikit-learn](https://scikit-learn.org/stable/).

## To pull the image from Docker Hub:
```bash
> docker pull jusher/jupyterlab-minimalist:latest
```

## To start the container 
```bash
> docker run -it -p 8888:8888 \
  -w /home/jordan/work \
  --mount type=bind,src="$(pwd)"/project,dst=/home/jordan/work \
  jusher/jupyterlab-minimalist:latest
```

# The Goals of this Project:

A minimalist image, built from a small Dockerfile (~30 lines) that is easy to understand. This project should always aim to follow [Docker best practices](https://docs.docker.com/develop/dev-best-practices/) and in particular:

1. Use an intuitive Dockerfile that is easy to extend
2. Produce an image that is small as possible :
    - using [multi-stage builds](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#use-multi-stage-builds)
    - minimizing RUN, COPY, ADD commands
    - minimizing dependencies
3. Start with an appropriate base image (i.e., [Official Python Docker](https://hub.docker.com/_/python)) 

Disclaimer: **This is experimental.**  You should review the Dockerfile and test the image carefully before putting this in production. Feedback is welcome.

## The Problem

Setting up a local environment for data science is cumbersome. Between environment and dependency management, many hours can be spent on configuration before any work can begin.

## The Benefits of Containerization

A good way to create consistent, portable and isolated environments is containerization. Containers can be preconfigured with packages and software installed. They are efficient and can be shared easily.

The solutions discussed and implemented here will focus on containerization as opposed to environment managers like [Anaconda](https://www.anaconda.com/) or [Virtualenv](https://virtualenv.pypa.io/en/latest/#).

For a more in-depth rundown of containers, consider reading some good introductions by [NetApp](https://www.netapp.com/us/info/what-are-containers.aspx) and [Google](https://cloud.google.com/containers) and [Docker](https://www.docker.com/resources/what-container).

# Existing Solutions

Currently, [Jupyter Docker Stacks](https://jupyter-docker-stacks.readthedocs.io/en/latest/) leverage the power of containerization to provide an array of Docker images for data science applications. Note: as of October 2023, these images are published to [Quay.io](https://quay.io/organization/jupyter) — the Docker Hub versions are frozen and no longer updated.

However, the resulting images from Jupyter Docker Stacks are quite large and some other downsides include:

  - The Dockerfiles and startup scripts are long and somewhat difficult to follow
  - The images arguably violate the [best practice of decoupling](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#decouple-applications) (e.g., by including packages like TeX Live, git, vim)
  - The base image chain is complex (e.g., to extend `jupyter/scipy-notebook`, one must understand the base image hierarchy and their scripts:
    - `ubuntu:noble`
      - `docker-stacks-foundation`
        - `jupyter/base-notebook`
          - `jupyter/minimal-notebook`
            - `jupyter/scipy-notebook`

If you require Conda or JupyterHub, then Jupyter Docker Stacks is a good option for you. They also support R, Spark, TensorFlow, Julia and other kernels that this project does not (yet). However, this same approach has been used to build [PyTorch](https://github.com/gitjeff05/jupyterlab-minimalist-image/tree/main/dockerfiles/pytorch), [Astropy](https://github.com/gitjeff05/jupyterlab-minimalist-image/tree/main/dockerfiles/astropy), and [AI-enabled](https://github.com/gitjeff05/jupyterlab-minimalist-image/tree/main/dockerfiles/jupyter-ai) variants.

## Approach

We desired a solution based off the [Official Python Docker image](https://hub.docker.com/_/python). Why does this matter? [Starting with an appropriate base image](https://docs.docker.com/develop/dev-best-practices/#how-to-keep-your-images-small) is a best practice and helps reduce the complexity and size of the image. We also employ [multi-stage builds](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#use-multi-stage-builds) to produce a lean final image.

### Multi-stage build

The Dockerfile uses two stages:

1. **`builder`** — installs all Python packages from `requirements.txt` into an isolated virtual environment at `/venv`. This stage handles pip's temporary files, wheel downloads, and any build-time overhead.
2. **final** — starts from a fresh `python:3.13-slim-bookworm` base and copies only `/venv` from the builder using `COPY --from=builder`. No pip cache, no build artifacts, and no intermediate layers carry forward.

```
builder  →  installs packages into /venv
final    →  clean base + COPY --from=builder /venv /venv
```

This is what keeps the final image at 7 layers. The venv is self-contained — the `PATH` is updated to point into it, so `jupyter`, `python`, and all installed packages are available without any system-level installation.

## Results

The resulting image is built from a ~28 line Dockerfile using a real multi-stage build. A comparison with `quay.io/jupyter/scipy-notebook` (measured March 2026) is shown below.

| Image  | # Layers | # lines in Dockerfile | Size |
|---|---|---|---|
| `jupyterlab-minimalist`  | 7  | 28 | 820 MB |
| `quay.io/jupyter/scipy-notebook`  | 37  | 190+ | 3.36 GB |

---

Number of lines in Dockerfile was calculated using all the dockerfiles in the chain with spaces and comments removed.

**Note**: This is not *exactly* a fair comparison because the scipy image from Jupyter Docker Stacks includes so much more (e.g., Conda, JupyterHub, Git, Emacs and more).

# How to Build and Run this Container:

## Build

To build the image from the root directory of this project:

```bash
docker build -t jupyterlab-minimalist:latest .
```

BuildKit is enabled by default in Docker 23+, so no additional flags are needed.

## Run

Suppose you want to work from some directory `/Users/alex/project`. To run with that directory mounted to the container, run:

```bash
docker run --rm -it -p 8888:8888 \
  -w /home/jordan/work \
  --mount type=bind,source=/Users/alex/project,target=/home/jordan/work \
  jupyterlab-minimalist:latest
```

## Include Additional Packages

Want to use ggplot or plotly? Simply modify the `requirements.txt` file and repeat the step in build.

## Using SSL

Generate certificates using [mkcert](https://github.com/FiloSottile/mkcert) — see the [cert folder README](https://github.com/gitjeff05/jupyterlab-minimalist-image/blob/main/cert/README.md) for setup instructions. Once you have `localhost.pem` and `localhost-key.pem`, pass them to the container:

```bash
docker run --rm -it -p 8888:8888 \
  -w /home/jordan/work \
  -v /Users/alex/project:/home/jordan/work \
  -v /Users/alex/certs:/home/jordan/certs \
  jupyterlab-minimalist:latest \
  --ip=0.0.0.0 --port=8888 \
  --certfile=/home/jordan/certs/localhost.pem \
  --keyfile=/home/jordan/certs/localhost-key.pem
```

Note: `ip` and `port` must be repeated here because they override the default `CMD`.

## Variants

The `dockerfiles/` directory contains purpose-built variants that follow the same pattern:

| Variant | Description |
|---|---|
| [`basic/`](dockerfiles/basic/) | Python + numpy + matplotlib only. No JupyterLab. |
| [`astropy/`](dockerfiles/astropy/) | Astronomy stack (astropy, astroplan). Plain Python or JupyterLab via `Dockerfile.jupyter`. |
| [`pytorch/`](dockerfiles/pytorch/) | Full scientific stack + PyTorch 2.x (CPU). Swap the index URL in `requirements.txt` for GPU builds. |
| [`jupyter-ai/`](dockerfiles/jupyter-ai/) | Full scientific stack + [jupyter-ai](https://github.com/jupyterlab/jupyter-ai) chat sidebar and `%%ai` cell magic. API key injected at runtime via env var. |

## Feedback

Any feedback is most welcome. Please feel free to [open an issue](https://github.com/gitjeff05/jupyterlab-minimalist-image/issues) or pull request if you would like to see any additional functionality or additional kernels added.

