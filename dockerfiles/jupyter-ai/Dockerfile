# syntax=docker/dockerfile:1
#
# JupyterLab + jupyter-ai variant.
# Adds a chat sidebar and %%ai cell magic to the base image.
# API keys are injected at runtime via environment variables — nothing is
# baked into the image.
#
# Supported env vars (pass whichever provider you use):
#   ANTHROPIC_API_KEY
#   OPENAI_API_KEY
#   GEMINI_API_KEY
#
# See README.md for usage.
FROM python:3.13-slim-bookworm AS builder

ARG REQ=requirements.txt
COPY ./${REQ} ./

RUN python -m venv /venv && \
    /venv/bin/pip install --no-cache-dir -r ${REQ}


FROM python:3.13-slim-bookworm

ARG NB_USER="jordan"
ARG NB_UID="1000"
ARG NB_GID="100"

RUN useradd -m -s /bin/bash -g ${NB_GID} -u $NB_UID $NB_USER

COPY --from=builder /venv /venv

WORKDIR /home/${NB_USER}

USER ${NB_USER}

ENV PATH="/venv/bin:$PATH"

EXPOSE 8888
ENTRYPOINT ["jupyter", "lab"]
CMD ["--port=8888", "--no-browser", "--ip=0.0.0.0"]
