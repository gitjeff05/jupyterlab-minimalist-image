# JupyterLab Container

This container was built to include everything required for the [MITx 6.86x Machine Learning with Python-From Linear Models to Deep Learning class on edX](https://www.edx.org/course/machine-learning-with-python-from-linear-models-to). To name a few:

```
jupyterlab==3.0.7
numpy==1.20.0
pandas==1.2.1
scikit-learn==0.24.1
scipy==1.6.0
seaborn==0.11.1
matplotlib==3.3.4
```

**Familiarity with Docker is highly recommended** (i.e., users should understand how to build from a dockerfile, run a container and bind mount a directory from their host machine to the container).

## Build the image

First build the container from this directory, lets name it `MITx6.86:v1` or anything you want:

```bash
> DOCKER_BUILDKIT=1 docker build -t MITx6.86:v1 .
```

## Run the container

```bash
> docker run --rm -it -p 8888:8888 \
  -w /home/jordan/work \
  --mount type=bind,src=/path/to/class,dst=/home/jordan/work \
  MITx6.86:v1
```

# Important Note:

Containers are supposed to be ephemeral and as such, the `--rm` flag removes the container after it exits. This is no big deal if you have mounted your directory properly. Your work will persist on your host machine in the directory specified by `src` above. Using `--rm` is a personal preference and users should be familiar with how bind mounts work and understand that **any work saved outside of** `/home/jordan/work` on the container **will not persist** when using the `--rm` flag.

# Regarding use of Python 3.9

The class specifies using **Python 3.6**. If this ends up being an issue, simply set the base image at the top of the dockerfile:

```
FROM python:3.6-slim-buster AS base
```

Then, you will have to backtrack a few dependencies in `requirements.txt`:

```
numpy==1.19.5
pandas==1.1.5
scipy==1.5.4
```

Rebuild the image and you should be good to go.

# Issues

[File an issue](https://github.com/gitjeff05/jupyterlab-minimalist-image/issues) if something is not working well for you.