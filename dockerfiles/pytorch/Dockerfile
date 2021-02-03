FROM python:3.9.1-slim-buster AS base

ARG REQ=requirements.txt

ARG NB_USER="jordan"
ARG NB_UID="1000"
ARG NB_GID="100"

# Add a new user with useradd
# -m           // --> create user's home directory
# -s /bin/bash // --> set the shell of the user
# -g ${NB_GID} // --> ID of the primary group of the new account
# -u $NB_UID   // --> user ID of the new account
# $NB_USER     // --> set user name
RUN useradd -m -s /bin/bash -g ${NB_GID} -u $NB_UID $NB_USER

WORKDIR /home/${NB_USER}

ENV PATH="/home/${NB_USER}/.local/bin:$PATH"

USER ${NB_USER}

COPY ./${REQ} ./

RUN pip install --no-cache-dir -r ${REQ} \
    && python -m pip install --upgrade pip

FROM base as appdeps

USER root

# In order to install JupyterLab extensions, we need to have Node.js installed.
# Thanks to https://github.com/nodesource/distributions
RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    && rm -rf /var/lib/apt/lists/*

RUN wget -qO- https://deb.nodesource.com/setup_14.x | bash - \
    && apt-get install -y nodejs \
    && rm -rf /var/lib/apt/lists/*

USER ${NB_USER}

FROM appdeps

EXPOSE 8888
ENTRYPOINT [ "jupyter", "lab" ]
CMD ["--port=8888", "--no-browser", "--ip=0.0.0.0"]
