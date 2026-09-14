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
    result={"success":True,
                "data":None,
                "msg":""}
    try:
        if not credentials:
            raise Exception("토큰이 없습니다. 토큰 보내줘.")
        token = credentials.credentials
        user_info=decode_access_token(token)
        print(f"#user_info:",user_info)
        if not user_info:
            raise Exception("토큰이 유효하지 않습니다.")
        user_id=user_info["id"]
    except Exception as e:
        pass