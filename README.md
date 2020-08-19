# Jupyterlab container image

**Warning: Experimental and untested code. Not meant for production**

This repository contains everything that is needed to build a lightweight* Jupyterlab image. The goal is to produce a short and simple Dockerfile containing everything needed to produce a all required data analysis and ML tools (i.e., jupyterlab, pandas, numpy, python, pip, matplotlob, nodejs, etc).

## The problem

Currently, we have been using [jupyter docker stacks](https://jupyter-docker-stacks.readthedocs.io/en/latest/) as the preferred images for ML. These images are supported by the community and are flexible in what they offer. However there are some drawbacks:

  - The chain of base images is complex `ubuntu:focal` -> `jupyter/base` -> `jupyter/minimal` -> `jupyter/scipy`
  - The Dockerfiles are verbose with a lot of custom scripting.
  - The size of the images is huge:

| Image  | Layers  | Size (GB) | 
|---|---|---|
| jupyter/scipy-notebook  | 22  | 3.93 |
| jupyter/scipy-notebook  | 19  | 2.96 |

## Idea

We wanted to see if we could begin from a [Docker verified image (Python)](https://hub.docker.com/_/python?tab=description) and use minimal configuration to build an image that contains all of what we need. The image we produced:

| Image  | Layers  | Size (GB) | 
|---|---|---|
| test-python-image | 9  | 0.5 |

Additionally,

  - The resulting image size is **%15** of the larger scipy notebook.
  - The image was created with **15** lines of dockerfile and is intuitive.
  - The chain of base images is simple `python:3.7.8-slim-buster` -> `test-python-image`
  - Only uses `pip` as a package manager.

```bash session
> docker build -t test-python-image .
> docker run --rm -it -p 8888:8888 test-python-image
```

## TODO

There is some investigation to be done to see if this image can do everything that `jupyter-docker-stacks` can do. Additional tests should be done to verify the integrity and ensure that the image is as secure as possible.