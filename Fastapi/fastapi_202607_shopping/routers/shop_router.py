from fastapi import APIRouter, Form, Header, Security
from utils.db import get_db
from utils.enc_dec import hash_password,verify_password
from utils.jwtutil import create_access_token, decode_access_token
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
router=APIRouter()
bearer_scheme = HTTPBearer(auto_error=False)

@router.post("/upsert_product")
def upsert_product(name=Form("")
                   ,price=Form("0")
                   ,category_id=Form("0")
                   ,credentials: HTTPAuthorizationCredentials 
                              | None = Security(bearer_scheme)):
    try:
        pass
    except Exception as e:
        pass