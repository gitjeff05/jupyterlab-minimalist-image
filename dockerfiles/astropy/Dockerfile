# syntax=docker/dockerfile:1
FROM python:3.13-slim-bookworm AS builder

ARG REQ=requirements.txt
COPY ./${REQ} ./

RUN python -m venv /venv && \
    /venv/bin/pip install --no-cache-dir -r ${REQ}


FROM python:3.13-slim-bookworm

RUN groupadd developers && useradd --no-user-group --no-log-init -g developers -m joe

COPY --from=builder /venv /venv

WORKDIR /home/joe

USER joe

ENV PATH="/venv/bin:$PATH"

CMD ["python"]
