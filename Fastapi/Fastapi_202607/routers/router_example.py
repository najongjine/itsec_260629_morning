from fastapi import APIRouter, Form
from utils.db import get_db

router=APIRouter()

@router.get("/query-string1")
def query_string_example(name:str,age:int):
    result={"success":True,
            "data":None,
            "msg":""}
    try:
        result["data"]={
            "안내문":"데이터 잘 받았어요",
            "받은데이터":f"이름:{name}, 나이는{age/0}"
        }
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


@router.get("/db-conn-test")
def db_conn_test(name:str=""):
    result={"success":True,
            "data":None,
            "msg":""}
    try:
        with get_db() as conn:
            cursor=conn.cursor()
            cursor.execute("""
                SELECT NOW()
            """)
            data=cursor.fetchall()
            cursor.close()
        result["data"]=data
    except Exception as e:
        result["success"]=False
        result["msg"]=str(e)
    
    return result