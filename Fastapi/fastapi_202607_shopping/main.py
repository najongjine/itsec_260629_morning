import os
from contextlib import asynccontextmanager

from fastapi import FastAPI
import uvicorn
from fastapi.middleware.cors import CORSMiddleware
from utils.db import close_db_pool

#from routers.router_example import router as example_router
from routers.user_router import router as user_router
from routers.shop_router import router as shop_router

# 서버 뿅 하고 완성 됨
@asynccontextmanager
async def lifespan(_: FastAPI):
    yield
    close_db_pool()


app = FastAPI(lifespan=lifespan)
app.add_middleware(
    CORSMiddleware
    ,allow_origins=["*"]
    ,allow_credentials=True
    ,allow_methods=["*"]
    ,allow_headers=["*"]
)

#app.include_router(example_router,tags=["예제 API"])
app.include_router(user_router,tags=["user"])
app.include_router(shop_router,tags=["shop"])

# api endpoint, router, controller
@app.get("/")
def healthcheck():
    return {"success": True, "msg": "server is healthy"}


@app.get("/health")
def health():
    return {"status": "ok"}

if __name__=="__main__":
    uvicorn.run(
        "main:app",
        host=os.getenv("HOST", "0.0.0.0"),
        port=int(os.getenv("PORT", "7860")),
        reload=os.getenv("RELOAD", "false").lower() == "true",
    )

