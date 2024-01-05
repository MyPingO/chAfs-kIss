from passlib.context import CryptContext
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm

# use the bcrypt hashing algorithm to hash the password
password_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# use OAuth2PasswordBearer to authenticate the user
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

def hash_password(password: str) -> str:
    return password_context.hash(password)

def verify_password(password: str, hashed_password: str) -> str:
    return password_context.verify(password, hashed_password)