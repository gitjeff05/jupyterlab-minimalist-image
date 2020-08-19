FROM python:3.7.8-slim-buster AS base

ARG REQ=requirements.txt

ARG NB_USER="alice"
ARG NB_UID="1000"
ARG NB_GID="100"

# Add a new user
# -m           // --> create user's home directory
# -s /bin/bash // --> set the shell of the user
# -g ${NB_GID} // --> ID of the primary group of the new account
# -u $NB_UID   // --> user ID of the new account
# $NB_USER     // --> set user name
# unsure if chown is necessary.
RUN useradd -m -s /bin/bash -g ${NB_GID} -u $NB_UID $NB_USER \
    && chown -R ${NB_USER}:${NB_GID} /home/alice

WORKDIR /home/alice

COPY ./${REQ} ./

ENV PATH="/home/alice/.local/bin:$PATH"

USER ${NB_USER}

RUN pip install --no-cache-dir -r ${REQ}

USER root

# In order to install JupyterLab extensions, we need to have Node.js installed.
RUN apt-get update; \
    apt-get install -y --no-install-recommends wget; \
    wget -qO- https://deb.nodesource.com/setup_12.x | bash -; \
    apt-get install -y nodejs

USER ${NB_USER}

FROM base

EXPOSE 8888
ENTRYPOINT [ "jupyter", "lab" ]

