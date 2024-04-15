from flask_mail import Mail


def init_mail(app):
    global mail
    mail = Mail(app)
    return mail

def get_mail():
    return mail