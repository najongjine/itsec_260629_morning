from fastapi import APIRouter, Form, Header, Security
from utils.db import get_db
from utils.enc_dec import hash_password,verify_password
from utils.jwtutil import create_access_token, decode_access_token
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
router=APIRouter()
bearer_scheme = HTTPBearer(auto_error=False)

@router.get("/productlist")
def productlist():
    result={"success":True,
            "data":None,
            "msg":""}
    try:
        with get_db() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    SELECT
                    p.id as "product_id"
                    ,p.name
                    ,p.price
                    ,p.category_id
                    ,p.created_dt
                    ,u.id as "user_id"
                    ,u.username
                    FROM t_product as p
                    JOIN t_user as u
                    ON p.user_id = u.id
                    ORDER BY p.created_dt DESC
                """
                    ,()
                )
                rows=cursor.fetchall()
                columns = [
                    desc[0]
                    for desc in cursor.description
                ]
                data = [
                    dict(zip(columns, row))
                    for row in rows
                ]
        result["data"]=data
    except Exception as e:
        result["success"]=False
        result["msg"]=str(e)
    
    return result

@router.get("/get_a_product")
def get_a_product(id:str="0"):
    result={"success":True,
            "data":None,
            "msg":""}
    try:
        id=int(id)
        with get_db() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    SELECT
                    p.id as "product_id"
                    ,p.name
                    ,p.price
                    ,p.category_id
                    ,p.created_dt
                    ,u.id as "user_id"
                    ,u.username
                    FROM t_product as p
                    JOIN t_user as u
                    ON b.user_id = u.id
                    WHERE b.id = %s
                """
                    ,(id,)
                )
                row=cursor.fetchone()
                if row is None:
                    result["success"]=False
                    result["msg"]="그런 상품 없음"
                    return result
                columns = [
                    desc[0]
                    for desc in cursor.description
                ]
                data = dict(zip(columns, row))
                data["created_dt"] = data["created_dt"].isoformat()
        result["data"]=data
    except Exception as e:
        result["success"]=False
        result["msg"]=str(e)
    
    return result

@router.post("/upsert_product")
def upsert_product(name=Form("")
                   ,price=Form("0")
                   ,category_id=Form("0")
                   ,product_id=Form("0")
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
        product_id=int(product_id)

        with get_db() as conn:
            with conn.cursor() as cursor:
                if product_id <= 0:
                    cursor.execute("""
                        INSERT INTO t_product
                        (name,price,user_id,category_id)
                        VALUES
                        (%s,%s,%s,%s)
                        RETURNING id, name, price,category_id, created_dt
                    """
                        ,(name,price,user_id,category_id)
                    )
                else:
                    cursor.execute("""
                        UPDATE t_product
                        SET name=%s
                        ,price=%s
                        ,category_id=%s
                        WHERE id=%s AND user_id=%s
                        RETURNING id, name, price, category_id, user_id,created_dt
                    """
                        ,(name,price,category_id,product_id,user_id)
                    )
                row=cursor.fetchone()
                columns = [
                    desc[0]
                    for desc in cursor.description
                ]
                data = dict(zip(columns, row))
                data["created_dt"] = data["created_dt"].isoformat()

        result["data"]=data
    except Exception as e:
        pass