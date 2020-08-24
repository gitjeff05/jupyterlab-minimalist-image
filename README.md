# Minimalist JupyterLab Docker Image

A [lightweight](https://github.com/gitjeff05/jupyterlab-minimalist-image#the-result) Docker image for Python, [JupterLab](https://jupyterlab.readthedocs.io), [Numpy](https://numpy.org/), [Pandas](https://pandas.pydata.org/), [Matplotlib](https://matplotlib.org/) and [scikit-learn](https://scikit-learn.org/stable/).

## The Goals of this Project:

A minimalist image, built from a small Dockerfile (~20 lines) that is easy to extend. Specifically, this project should always aim to:

1. Use a Dockerfile that is simple and intuitive
2. Produce an image that is small as possible by:
    - using [multi-stage builds](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#use-multi-stage-builds)
    - minimizing RUN, COPY, ADD commands
    - minimizing dependencies
3. Be easy to extend with additional packages based on user preferences
4. Follow best practices and [start with an appropriate base image](https://docs.docker.com/develop/dev-best-practices/#how-to-keep-your-images-small) (i.e., [Official Python Docker](https://hub.docker.com/_/python))

Disclaimer: **This is experimental.**  It is safe enough to use locally, but not yet meant for production until others have had a chance to review.

## The Problem

Setting up a local environment for data science is cumbersome. Between environment and dependency management, many hours can be spent on configuration before any work can begin.

## The Benefits of Containerization

A good way to create consistent, portable and isolated environments is containerization. Containers can be preconfigured with packages and software installed. They are efficient and can be shared easily.

The solutions discussed and implemented here will focus on containerization as opposed to environment managers like [Anaconda](https://www.anaconda.com/) or [Virtualenv](https://virtualenv.pypa.io/en/latest/#).

For a more in-depth rundown of containers, consider reading some good introductions by [NetApp](https://www.netapp.com/us/info/what-are-containers.aspx) and [Google](https://cloud.google.com/containers) and [Docker](https://www.docker.com/resources/what-container).

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

If you require Conda or JupyterHub, then Jupyter Docker Stacks is a good option for you. They also support R, Spark, TensorFlow, Julia and other kernels that this project does not. There are definitely cases where Jupyter Docker Stacks is a great option and I have many times used them myself.

## The Approach

We desired a solution based off the [Official Python Docker image](https://hub.docker.com/_/python). Why does this matter? [Starting with an appropriate base image](https://docs.docker.com/develop/dev-best-practices/#how-to-keep-your-images-small) is a best practice and helps reduce the complexity and size of the image. We also employ [multi-stage builds](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#use-multi-stage-builds) which reduces the build time and provides efficiencies for extending the image.

## The Result

The resulting image is built from a ~20 line Dockerfile and results in a 663MB image. A comparison with jupyter/scipy-notebook is shown below.

| Image  | # Layers | # lines in Dockerfile | Size (GB) | 
|---|---|---|---|
| `jupyterlab-minimalist`  | 10  | 22 | 0.663 |
| `jupyter/scipy-notebook`  | 21  | 190 | 2.67 |

---

**Note**: This is not *exactly* a fair comparison because the scipy image from Jupyter Docker Stacks includes so much more (e.g., Conda, JupyterHub, Git, Emacs and more). Also the "# lines in Dockerfile" was calculated using all the dockerfiles in the chain with spaces and comments removed.

# How to Build and Run this Container:

## Build

Currently, this image is not published to a registry. As a result, you *cannot* use `docker pull` yet. To build the image just run the following from the root directory of this project:

```bash
> export DOCKER_BUILDKIT=1
> docker build -t jupyterlab-minimalist:v1 .
```
Note: Setting `DOCKER_BUILDKIT` enables [BuildKit](https://docs.docker.com/develop/develop-images/build_enhancements/). Although not required, it is recommended because it improves performance, storage and security. 

## Run

Suppose you want to work from some directory `/Users/alex/ml-projects`. To run with that directory mounted to the container, run:

```bash
> docker run --rm -it -p 8888:8888 \
  -v /Users/alex/ml-projects:/home/jordan/work \
  jupyterlab-minimalist:v1
```

## Include Additional Packages

Want to use ggplot or plotly? Simply modify the `requirements.txt` file and repeat the step in build.

## Using SSL

Assuming you have a generated your certificate and private key file, you can pass these to `jupyter lab` with the following:

```bash
> docker run --rm -it -p 8888:8888 \
  -v /Users/alex/ml-projects:/home/jordan/work \
  -v /Users/alex/certs:/home/jordan/certs \
  jupyterlab-minimalist:v1 \
  --ip=0.0.0.0 --port=8888 \
  --certfile=/home/jordan/certs/localhost.cert \
  --keyfile=/home/jordan/certs/localhost.key
```

Note that you have to resend the `ip` and `port` because we are overriding the `CMD` statement with certificate info. There may be a better way to do this but for right now this is the way.

Note, you may have to use `localhost` instead of the `127.0.0.1` if the domain on your generated certificate used `localhost` as the domain (devcert does not support creating certificate authorities with `127.0.0.1`).

See the [readme in the cert folder](https://github.com/gitjeff05/jupyterlab-minimalist-image/blob/master/cert/app.mjs) for more info on generating self-signed certificates for local development.

## Feedback

Any feedback is most welcome. Please feel free to [open an issue](https://github.com/gitjeff05/jupyterlab-minimalist-image/issues) or pull request if you would like to see any additional functionality or additional kernels added.

