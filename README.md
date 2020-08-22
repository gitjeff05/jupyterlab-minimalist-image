# Minimalist JupyterLab Docker Image

A lightweight* Docker image for Python, [JupterLab](https://jupyterlab.readthedocs.io), [Numpy](https://numpy.org/), [Pandas](https://pandas.pydata.org/), [Matplotlib](https://matplotlib.org/) and [scikit-learn](https://scikit-learn.org/stable/).

## The Goals of this Project:

An efficient and minimal image, built from a small Dockerfile (~20 lines). It should be easy to extend. Specifically, this project should always aim to:

1. Use a Dockerfile that is simple and intuitive
2. Produce an image that is small as possible by:
    - using [multi-stage builds](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#use-multi-stage-builds)
    - minimizing RUN, COPY, ADD commands
    - minimizing dependencies
4. Be easy to extend with additional packages based on user preferences
5. Follow best practices and [start with an appropriate base image](https://docs.docker.com/develop/dev-best-practices/#how-to-keep-your-images-small) (i.e., [Official Python Docker](https://hub.docker.com/_/python))

Disclaimer: **This is experimental.**  It is safe enough to use locally, but not yet meant for production until others have had a chance to review.

## The Problem

Setting up a local environment for data science is cumbersome. Between environment and dependency management, many hours can be spent on configuration before any work can begin.

## The Benefits of Containerization

One way to isolate environments so that they are predictable, portable and stable is containerization. Images come preconfigured with packages and software installed and are quick to boot. The solutions discussed and implemented here will focus on containerization as opposed to environment managers like [Anaconda](https://www.anaconda.com/) or [Virtualenv](https://virtualenv.pypa.io/en/latest/#).

## Existing Solutions

Currently, [Jupyter Docker Stacks](https://jupyter-docker-stacks.readthedocs.io/en/latest/) leverage the power of containerization to provide an array of Docker images for data science applications. The author of this project has the upmost respect for jupyter docker stacks.

However, the resulting images from Jupyter Docker Stacks can be quite large and there are cases where a slimmer image is desired. Additionally, some potential downsides to Jupyter Docker Stacks include:
  
  - The Dockerfiles and startup scripts are long and somewhat difficult to follow
  - The images arguably violate the [best practice of decoupling](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#decouple-applications) (e.g., by including packages like inkscape, emacs, vim, git)
  - The base image chain is complex (i.e., to extend `jupyter/scipy-notebook`, one must have working knowledge of:
    - `ubuntu:focal` 
      - `jupyter/base-notebook`
        - `jupyter/minimal-notebook`
          - `jupyter/scipy-notebook`

If you require Conda or JupyterHub, then Jupyter Docker Stacks is a good option for you. They also support R, Spark, TensorFlow, Julia and other kernels that this project does not.

## The Approach

We desired a solution based off the [Official Python Docker image](https://hub.docker.com/_/python). Why does this matter? [Starting with an appropriate base image](https://docs.docker.com/develop/dev-best-practices/#how-to-keep-your-images-small) is a best practice and helps reduce the complexity and size of the image. We also employ [multi-stage builds](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#use-multi-stage-builds) which reduces the build time and provides efficiencies for extending the image.

## The Result

The resulting image is built from a ~20 line Dockerfile and results in a 663MB image.

## Comparison with jupyter/scipy-notebook:

| Image  | # Layers | # lines in Dockerfile | Size (GB) | 
|---|---|---|---|
| `jupyterlab-minimalist`  | 10  | 21 | 0.663 |
| `jupyter/scipy-notebook`  | 21  | 190 | 2.67 |

---

**Note**: This is not exactly a fair comparison because the scipy image from Jupyter Docker Stacks includes so much more (e.g., Conda, JupyterHub, Git, Emacs and more).

# How to Run

## Build

Currently, this image is not published to a registry. As a result, you *cannot* use `docker pull` yet. To build the image just run the following from the root directory:

```bash
> export DOCKER_BUILDKIT=1
> docker build -t jupyterlab-minimalist:v1 .
```
Note: Setting `DOCKER_BUILDKIT` enables [BuildKit](https://docs.docker.com/develop/develop-images/build_enhancements/). Although not required, it is recommended because it improves performance, storage and security. 

## Run the Container

Suppose you want to work from some directory `/Users/alex/ml-projects`. To run with that directory mounted to the container, run:

```bash
> docker run --rm -it -p 8888:8888 \
  -v /Users/alex/ml-projects:/home/jordan/work \
  jupyterlab-minimalist:v1
```

## Include Additional Packages

Simply modify the `requirements.txt` file and repeat the step in build.

## Use Certificates so you can use https

There are some nice tools for using https locally should you want to. [Devcert](https://github.com/davewasmer/devcert) and [MakeCert](https://github.com/FiloSottile/mkcert) provide excellent tooling for not only generating certificates, but also for also signing them with a self-generated certificate authority. See the `./cert` directory as it has some direction to help you get setup with devcert.

Once you have generated certs for localhost, it is as simple as mounting them and running:

```bash
> docker run --rm -it -p 8888:8888 \
  -v /Users/alex/ml-projects:/home/jordan/work \
  -v /Users/alex/certs:/home/jordan/certs \ # mount certs
  jupyterlab-minimalist:v1 \
  --ip=0.0.0.0 --port=8888 \ # set ip and port
  --certfile=/home/jordan/certs/localhost.cert \
  --keyfile=/home/jordan/certs/localhost.key
```

Note that you have to resend the `ip` and `port` because we are overriding the `CMD` statement with certificate info. There may be a better way to do this but for right now this is the way.

Also, you may have to use `localhost` instead of the `127.0.0.1` if the domain on your generated certificate used `localhost` as the domain.

## Feedback

Any feedback is most welcome. Please feel free to open an issue or pull request if you would like to see any additional functionality or additional kernels added.