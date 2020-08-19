# Configuration file for jupyter-notebook.

## The full path to an SSL/TLS certificate file.
# c.NotebookApp.certfile = 'mycert.pem'

## The IP address the notebook server will listen on.
c.NotebookApp.ip = '0.0.0.0'

## The full path to a private key file for usage with SSL/TLS.
# c.NotebookApp.keyfile = 'mykey.key'

## The directory to use for notebooks and kernels.
c.NotebookApp.notebook_dir = '/home/alice/work'

## Whether to open in a browser after starting. The specific browser used is
#  platform dependent and determined by the python standard library `webbrowser`
#  module, unless it is overridden using the --browser (NotebookApp.browser)
#  configuration option.
c.NotebookApp.open_browser = False

## The port the notebook server will listen on (env: JUPYTER_PORT).
c.NotebookApp.port = 8888