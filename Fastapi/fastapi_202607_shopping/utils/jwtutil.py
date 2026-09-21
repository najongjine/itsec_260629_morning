import os
from datetime import datetime, timedelta, timezone

import jwt
from dotenv import load_dotenv
from jwt.exceptions import InvalidTokenError

load_dotenv()

ALGORITHM = "HS256"
# 60분 × 24시간 × 365일
ACCESS_TOKEN_EXPIRE_MINUTES = 60*24*365


def _get_secret_key() -> str:
    secret_key = os.getenv("JWT_SECRET_KEY")
    if not secret_key:
        raise RuntimeError("JWT_SECRET_KEY environment variable is not configured.")
    return secret_key

def create_access_token(
        data:dict
        ,expire_duration=ACCESS_TOKEN_EXPIRE_MINUTES
):
    to_encode=data.copy()
    expire=datetime.now(timezone.utc) + timedelta(
        minutes=expire_duration
    )
    to_encode.update({"exp":expire})
    token=jwt.encode(
        to_encode
        ,_get_secret_key()
        ,algorithm=ALGORITHM
    )
    return token

def decode_access_token(token:str):
    try:
        payload= jwt.decode(
            token
            ,_get_secret_key()
            ,algorithms=[ALGORITHM]
        )
        return payload
    except InvalidTokenError:
        return None
