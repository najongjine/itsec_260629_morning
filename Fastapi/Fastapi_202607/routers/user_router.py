from fastapi import APIRouter, Form
from utils.db import get_db
from utils.enc_dec import hash_password,verify_password
from utils.jwtutil import create_access_token, decode_access_token

router=APIRouter()

@router.post("/register")
def register(username:str=Form("")
            ,password:str=Form("")
            ,email:str=Form("")
            ,gender:str=Form("")
            ):
    result={"success":True,
                "data":None,
                "msg":""}
    try:
        password=hash_password(password)
        with get_db() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO t_user
                    (username,password,email,gender)
                    VALUES
                    (%s,%s,%s,%s)
                    RETURNING *
                """
                    ,(username,password,email,gender)
                )
                row=cursor.fetchOne()
        row["password"]=""
        columns = [
            desc[0]
            for desc in cursor.description
        ]
        data = dict(zip(columns, row))
        token=create_access_token(data=data)
        result["data"]=token
    except Exception as e:
        result["success"]=False
        result["msg"]=str(e)
    return result


@router.get("/db-conn-test")
def db_conn_test(name:str=""):
    result={"success":True,
            "data":None,
            "msg":""}
    try:
        with get_db() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    SELECT NOW()
                """)
                data=cursor.fetchall()
        result["data"]=data
    except Exception as e:
        result["success"]=False
        result["msg"]=str(e)
    
    return result