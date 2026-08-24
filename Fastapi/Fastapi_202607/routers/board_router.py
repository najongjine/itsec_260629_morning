from fastapi import APIRouter, Form
from utils.db import get_db

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
                row=cursor.fetchall()
            result["data"]=row
    except Exception as e:
        result["success"]=False
        result["msg"]=str(e)
    
    return result


@router.post("/post-example")
def postmethod_example(name:str=Form("")
                       ,password:str=Form("")):
    result={"success":True,
                "data":None,
                "msg":""}
    try:
        result["data"]={
            "안내문":"데이터 잘 받았어요",
            "받은데이터":f"이름:{name}, password:{password}"
        }
    except Exception as e:
        result["success"]=False
        result["msg"]=str(e)
    return result

