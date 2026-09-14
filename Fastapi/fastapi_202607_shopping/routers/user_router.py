from fastapi import APIRouter, Form, Header

router=APIRouter()

@router.post("/register")
def register(
    username=Form("")
    ,password=Form("")
    ,email=Form("")
    ,gender=Form("m")
    ,address=Form("")
):
    result={"success":True
            ,"data":None
            ,"msg":""}
    try:
        pass
    except Exception as e:
        result["success"]=False
        result["msg"]=str(e)
    return result