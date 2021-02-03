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

```
DOCKER_BUILDKIT=1 docker build -t MITx6.86:v1 .
```

## Run the container

```
docker run --rm -it -p 8888:8888 \
  -w /home/jordan/work
  --mount type=bind,src=/path/to/class,dst=/home/jordan/work \
  MITx6.86:v1
```

## Important Note:

Containers are supposed to be ephemeral and as such I use the `--rm` flag to cleanup and remove the container entirely after it exits. This is no big deal if you have mounted your directory properly. Your work will persist on your host machine in the directory specified by `src` above. Using `--rm` is a personal preference and users should be familiar with how bind mounts work and understand that **any work saved outside of** `/home/jordan/work` **will not persist** when using the `--rm` flag.