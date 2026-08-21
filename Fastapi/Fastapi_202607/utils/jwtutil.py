from datetime import datetime, timedelta, timezone

import jwt
from jwt.exceptions import InvalidTokenError


SECRET_KEY = "my-super-secret-key-change-this"
ALGORITHM = "HS256"
# 60분 × 24시간 × 365일
ACCESS_TOKEN_EXPIRE_MINUTES = 60*24*365

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
        ,SECRET_KEY
        ,algorithm=ALGORITHM
    )
    return token