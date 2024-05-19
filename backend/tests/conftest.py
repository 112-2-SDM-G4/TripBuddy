import pytest
from main import app

@pytest.fixture()
def app():
    app.testing = True

    yield app

@pytest.fixture()
def client(app):
    return app.test_client()

@pytest.fixture()
def runner(app):
    return app.test_cli_runner()