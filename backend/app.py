from flask import Flask, render_template, request, redirect, url_for, flash
from flask_login import LoginManager, login_user, logout_user, login_required, UserMixin

app = Flask(__name__)
app.secret_key = 'your_secret_key_here'

# Flask-Login configurations (maybe useful later)
# login_manager = LoginManager()
# login_manager.init_app(app)
# login_manager.login_view = 'login'

from backend.routes import *

# User model (maybe useful later)
# class User(UserMixin):
#     def __init__(self, id):
#         self.id = id

