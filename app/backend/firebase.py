import os
import firebase_admin
from firebase_admin import credentials, firestore

firebase_credentials_path = os.environ.get("FIREBASE_CREDENTIALS_PATH")
credentials = credentials.Certificate(firebase_credentials_path)
firebase_admin.initialize_app(credentials)

db = firestore.client()