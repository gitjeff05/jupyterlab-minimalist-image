# JupyterLab + AI

This image extends the base minimalist image with [jupyter-ai](https://github.com/jupyterlab/jupyter-ai), the official Jupyter Project AI extension. It adds a chat sidebar and `%%ai` cell magic — no API key is baked into the image.

## What you get

- **Chat sidebar** (Jupyternaut) — ask questions, reference cells and errors, generate code
- **Error diagnosis** — drag a cell with an exception into chat for a diagnosis and fix suggestion
- **`%%ai` cell magic** — run a model inline from any notebook cell
- **`%ai fix` magic** — explain the most recent exception directly in the notebook

Supported out of the box: Anthropic (Claude), OpenAI (GPT), and [many others](https://jupyter-ai.readthedocs.io/en/latest/users/index.html#model-providers).

## Build

```bash
docker build -t jupyterlab-minimalist-ai:latest .
```

## Run

Pass your API key as an environment variable. The image never stores it.

**Anthropic (Claude):**
```bash
docker run --rm -it -p 8888:8888 \
  -e ANTHROPIC_API_KEY=sk-ant-... \
  -w /home/jordan/work \
  --mount type=bind,src=$(pwd)/project,dst=/home/jordan/work \
  jupyterlab-minimalist-ai:latest
```

**OpenAI:**
```bash
docker run --rm -it -p 8888:8888 \
  -e OPENAI_API_KEY=sk-... \
  -w /home/jordan/work \
  --mount type=bind,src=$(pwd)/project,dst=/home/jordan/work \
  jupyterlab-minimalist-ai:latest
```

**Using an env file** (recommended — keeps keys out of your shell history):
```bash
# .env
ANTHROPIC_API_KEY=sk-ant-...
```
```bash
docker run --rm -it -p 8888:8888 \
  --env-file .env \
  -w /home/jordan/work \
  --mount type=bind,src=$(pwd)/project,dst=/home/jordan/work \
  jupyterlab-minimalist-ai:latest
```

## Usage

### Chat sidebar

Open the Jupyternaut chat panel from the left sidebar. Select your model provider and model name in the settings (gear icon), then start chatting. You can reference your current notebook, ask it to explain or fix a cell, or generate new code.

### Cell magic

Run a model directly from a notebook cell:

```
%%ai anthropic:claude-sonnet-4-5
Explain what the previous cell is doing and suggest any improvements.
```

```
%%ai openai:gpt-4o
Write a function that normalizes a pandas DataFrame column to [0, 1].
```

Explain the most recent exception:
```python
%ai fix
```

List all configured providers:
```python
%ai list
```

## Adding more providers

To add providers beyond Anthropic and OpenAI, install their SDK and set the corresponding environment variable. See the [jupyter-ai provider docs](https://jupyter-ai.readthedocs.io/en/latest/users/index.html#model-providers) for the full list.
