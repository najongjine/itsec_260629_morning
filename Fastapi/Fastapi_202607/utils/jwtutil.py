from datetime import datetime, timedelta, timezone

import jwt
from jwt.exceptions import InvalidTokenError


SECRET_KEY = "my-super-secret-key-change-this"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30