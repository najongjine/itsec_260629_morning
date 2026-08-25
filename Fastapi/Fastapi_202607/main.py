from fastapi import FastAPI, Form
import uvicorn
from fastapi.middleware.cors import CORSMiddleware

from routers.router_example import router as example_router
from routers.user_router import router as user_router
from routers.board_router import router as board_router

# 서버 뿅 하고 완성 됨
app=FastAPI()
app.add_middleware(
    CORSMiddleware
    ,allow_origins=["*"]
    ,allow_credentials=True
    ,allow_methods=["*"]
    ,allow_headers=["*"]
)

app.include_router(example_router,tags=["예제 API"])
app.include_router(user_router,tags=["회원"])
app.include_router(board_router,tags=["게시판"])

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

