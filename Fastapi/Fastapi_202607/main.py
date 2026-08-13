from fastapi import FastAPI
import uvicorn

# 서버 뿅 하고 완성 됨
app=FastAPI()

# api endpoint, router, controller
@app.get("/")
def healthcheck():
    return {"success":True,"msg":"서버 건강함"}



if __name__=="__main__":
    uvicorn.run(
        "main:app",
        host="127.0.0.1",
        port=8000, # 3000~65000 중 맘대로 정함
        reload=True # ctrl + s 했을때 서버 자동으로 재시작
    )

