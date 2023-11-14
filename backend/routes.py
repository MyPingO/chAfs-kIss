from flask import Flask, render_template, request, redirect, url_for, flash
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from backend.app import app

# Flask routes
@app.route('/')
def index():
    return 'Hello, World!'

@app.route('/login', methods=['GET', 'POST'])
def login():
    return 'Login'

@app.route('/logout')
@login_required
def logout():
    logout_user()
    flash('Logged out successfully.')
    return redirect(url_for('index'))