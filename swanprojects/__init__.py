from ._version import __version__
from .handlers import setup_handlers
from .kernelmanager import kernelspecmanager 

def _jupyter_server_extension_paths():
    return [{"module": "swanprojects"}]


def load_jupyter_server_extension(lab_app):
    """Registers the API handler to receive HTTP requests from the frontend extension.
    Parameters
    ----------
    lab_app: jupyterlab.labapp.LabApp
        JupyterLab application instance
    """
    url_path = "swan"
    setup_handlers(lab_app.web_app, url_path)
    lab_app.log.info(
        "Registered swanprojects extension at URL path /{}".format(url_path)
    )
