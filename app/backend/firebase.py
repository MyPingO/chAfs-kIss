import os
import firebase_admin
from fastapi import HTTPException, Request
from firebase_admin import credentials, firestore, auth

firebase_credentials_path = os.environ.get("FIREBASE_CREDENTIALS_PATH")
credentials = credentials.Certificate(firebase_credentials_path)
firebase_admin.initialize_app(credentials)

db = firestore.client()

"""
Checks if a user is logged in by verifying their firebase token.
If the user is logged in, returns the user's id.
Otherwise, raises an HTTPException, blocking access to a route if used as a dependency.

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
        raise HTTPException(status_code=401, detail='Access Denied: Unauthorized')
    
    try:
        decoded_token = auth.verify_id_token(token)
        if decoded_token:
            return decoded_token['uid']
        else :
            raise HTTPException(status_code=401, detail='Access Denied: Unable to decode user token')
    except Exception as e:
        raise HTTPException(status_code=400, detail='Error verifying user token: {}'.format(e))
    
async def update_user_coin_count(user_id: str, quantity: int):
    user_ref = db.collection('users').document(user_id)
    doc = user_ref.get()

    if doc.exists:
        current_coins = doc.to_dict().get('coin_count', 0)
        new_coin_count = current_coins + quantity
        user_ref.update({'coin_count': new_coin_count})
    else:
        raise HTTPException(status_code=404, detail='User not found')