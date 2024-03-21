import os
import firebase_admin
from fastapi import HTTPException, Request
from firebase_admin import credentials, firestore, auth

firebase_credentials_path = os.environ.get("FIREBASE_CREDENTIALS_PATH")
credentials = credentials.Certificate(firebase_credentials_path)
firebase_admin.initialize_app(credentials)

db = firestore.client()

"""
Checks if a user is logged in by verifying their firebase token

Parameters:
    Request:
        headers: dict[str, str]
        
Returns:
    str:
        user_id
        
Raises:
    HTTPException:
    401: Unauthorized
    400: Error verifying user token
"""

def get_login_uid(request: Request) -> str:
    token = request.headers.get('Authorization')
    if not token:
        raise HTTPException(status_code=401, detail='Unauthorized')
    
    try:
        decoded_token = auth.verify_id_token(token)
        if decoded_token:
            return decoded_token['uid']
    except Exception as e:
        raise HTTPException(status_code=400, detail='Error verifying user token: {}'.format(e))