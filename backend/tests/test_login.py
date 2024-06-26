import unittest
from flask import url_for
from flask_testing import TestCase
from main import app, db

class SettingBase(TestCase):
    def create_app(self):
        return app
    
    def setUp(self):
        db.create_all()
        self.user_email = 'test@gmail.com'
        self.password = 'test'
    
    def tearDown(self):
        db.session.remove()

    def login(self):
        response = self.client.post(url_for('logincheckpassword'),
                                    follow_redirects = True,
                                    json={
                                        "user_email": self.user_email,
                                        "hashed_password": self.password
                                    })

        return response
    

class CheckUserLogin(SettingBase):
    def test_login(self):
        response = self.login()
        self.assert200(response)

    def test_login_401(self):
        self.password = 'teste'
        response = self.login()
        self.assert401(response)


if __name__ == '__main__':
    unittest.main()