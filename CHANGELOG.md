# Changelog

## [Unreleased] - 2026-03-19

### Changed
- Upgrade base image from `python:3.12-bullseye` to `python:3.13-slim-bookworm`
- Implement real multi-stage build: `builder` stage installs packages into `/venv`, final stage copies only `/venv` via `COPY --from=builder`
- Drop Node.js dependency — JupyterLab 4.x ships pre-built frontend assets
- Update all requirements to Python 3.13 compatible versions
- Update README with current measured image sizes, corrected image hierarchy, Quay.io registry references, and multi-stage build documentation

### Requirements
- numpy 2.2.1
- pandas 2.2.3
- scipy 1.15.0
- matplotlib 3.10.0
- seaborn 0.13.2
- bokeh 3.6.3
- jupyterlab 4.3.4
- jupyter-server 2.15.0
- jupyterlab-server 2.27.3
- ipykernel 6.29.5
- ipython 8.31.0
- scikit-learn 1.6.1
- sympy 1.13.3

---

## 2021-08-12

### Changed
- Update requirements.txt for v3

### Requirements
- numpy 1.21.1
- pandas 1.3.1
- scipy 1.7.1
- matplotlib 3.4.2
- seaborn 0.11.1
- bokeh 2.3.2
- jupyterlab 3.1.4
- jupyter-server 1.10.2
- jupyterlab-server 2.7.0
- ipykernel 6.0.3
- ipython 7.26.0
- scikit-learn 0.24.2
- sympy 1.8
