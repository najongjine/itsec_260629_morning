from fastapi import APIRouter, Form, Header
from utils.db import get_db
from utils.jwtutil import decode_access_token

router=APIRouter()

@router.get("/boardlist")
def boardlist():
    result={"success":True,
            "data":None,
            "msg":""}
    try:
        with get_db() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    SELECT
                    b.id as "board_id"
                    ,b.title
                    ,b.created_dt
                    ,u.id as "user_id"
                    ,u.username
                    FROM t_board as b
                    JOIN t_user as u
                    ON b.user_id = u.id
                    ORDER BY b.created_dt DESC
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


@router.post("/upsertboard")
def upsertboard(title:str=Form("")
                ,content:str=Form("")
                ,authorization: str = Header(None)
                ):
    result={"success":True,
                "data":None,
                "msg":""}
    try:
        # 1. Authorization 헤더 확인
        # 예: Authorization: Bearer eyJhbGciOi...
        if not authorization:
            raise Exception("토큰이 없습니다.")

        # 2. Bearer 제거
        token = authorization.replace("Bearer ", "")
        user_info=decode_access_token(token)
        user_id=user_info["id"]

        with get_db() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO t_board
                    (title,content,user_id)
                    VALUES
                    (%s,%s,%s)
                    RETURNING id, title, content, created_dt
                """
                    ,(title,content,user_id)
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
        result["success"]=False
        result["msg"]=str(e)
    return result

