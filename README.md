# Minimalist JupyterLab Docker Image

A [lightweight](https://github.com/gitjeff05/jupyterlab-minimalist-image#results) Docker image for Python, [JupterLab](https://jupyterlab.readthedocs.io), [Numpy](https://numpy.org/), [Pandas](https://pandas.pydata.org/), [Matplotlib](https://matplotlib.org/) and [scikit-learn](https://scikit-learn.org/stable/).

## To pull the image Docker Hub:
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

Currently, [Jupyter Docker Stacks](https://jupyter-docker-stacks.readthedocs.io/en/latest/) leverage the power of containerization to provide an array of Docker images for data science applications.

However, the resulting images from Jupyter Docker Stacks are quite large and some other downsides include:
  
  - The Dockerfiles and startup scripts are long and somewhat difficult to follow
  - The images arguably violate the [best practice of decoupling](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#decouple-applications) (e.g., by including packages like inkscape, emacs, vim, git)
  - The base image chain is complex (e.g., to extend `jupyter/scipy-notebook`, one must have understand the base image hierarchy and their scripts:
    - `ubuntu:focal` 
      - `jupyter/base-notebook`
        - `jupyter/minimal-notebook`
          - `jupyter/scipy-notebook`

If you require Conda or JupyterHub, then Jupyter Docker Stacks is a good option for you. They also support R, Spark, TensorFlow, Julia and other kernels that this project does not (yet). However, I have used this same setup to [create a Pytorch image](https://github.com/gitjeff05/jupyterlab-minimalist-image/tree/master/dockerfiles/pytorch) with success. It would certianly be possible to do others.

## Approach

We desired a solution based off the [Official Python Docker image](https://hub.docker.com/_/python). Why does this matter? [Starting with an appropriate base image](https://docs.docker.com/develop/dev-best-practices/#how-to-keep-your-images-small) is a best practice and helps reduce the complexity and size of the image. We also employ [multi-stage builds](https://docs.docker.com/develop/develop-images/dockerfile_best-practices/#use-multi-stage-builds) which reduces the build time and provides efficiencies for extending the image.

## Results

The resulting image is built from a ~30 line Dockerfile and results in a 864MB image. A comparison with jupyter/scipy-notebook is shown below.

| Image  | # Layers | # lines in Dockerfile | Size | 
|---|---|---|---|
| `jupyterlab-minimalist`  | 10  | 29 | 873 MB |
| `jupyter/scipy-notebook`  | 21  | 190 | 2.67 GB |

---

Number of lines in Dockerfile was calculated using all the dockerfiles in the chain with spaces and comments removed.

**Note**: This is not *exactly* a fair comparison because the scipy image from Jupyter Docker Stacks includes so much more (e.g., Conda, JupyterHub, Git, Emacs and more).

# How to Build and Run this Container:

## Build

Currently, this image is not published to a registry. As a result, you *cannot* use `docker pull` yet. To build the image just run the following from the root directory of this project:

```bash
> export DOCKER_BUILDKIT=1
> docker build -t jupyterlab-minimalist:v1 .
```
Note: Setting `DOCKER_BUILDKIT` enables [BuildKit](https://docs.docker.com/develop/develop-images/build_enhancements/). Although not required, it is recommended because it improves performance, storage and security. 

## Run

Suppose you want to work from some directory `/Users/alex/project`. To run with that directory mounted to the container, run:

```bash
> docker run --rm -it -p 8888:8888 \
  -w /home/jordan/work \
  --mount type=bind,source=/Users/alex/project,target=/home/jordan/work \
  jupyterlab-minimalist:v1
```

## Include Additional Packages

Want to use ggplot or plotly? Simply modify the `requirements.txt` file and repeat the step in build.

## Using SSL

Assuming you have a generated your certificate and private key file, you can pass these to `jupyter lab` with the following:

```bash
> docker run --rm -it -p 8888:8888 \
  -w /home/jordan/work \
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

