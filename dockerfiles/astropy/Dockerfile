# syntax=docker/dockerfile:1
FROM python:3.9-slim-buster AS pip-upgrade

RUN python -m pip install --upgrade pip

FROM pip-upgrade AS groups-users

RUN groupadd developers && useradd --no-user-group --no-log-init -g developers -m joe

ENV PATH=/home/joe/.local/bin:$PATH

WORKDIR /home/joe

USER joe

FROM groups-users AS install-deps

LABEL pip.astropy="4.3.1" \
      pip.matplotlib="3.4.3" \
      pip.numpy="1.21.1" \
      pip.scikit-learn="0.24.2"

COPY --chown=joe:developers requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

CMD [ "python" ]
