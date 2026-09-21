from fastapi import APIRouter, File, Form, Header, Security, UploadFile
from pathlib import Path
from utils.static import PRODUCT_IMAGE_DIR
from utils.db import get_db
from utils.enc_dec import hash_password,verify_password
from utils.imgbb import upload_image
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
                    ,c.name as "category_name"
                    ,(SELECT filepath FROM t_product_img as pi WHERE pi.product_id = p.id LIMIT 1) as "img"
                    FROM t_product as p
                    JOIN t_user as u ON p.user_id = u.id
                    JOIN t_category as c ON c.id = p.category_id
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

@router.get("/categorylist")
def categorylist():
    result={"success":True,
            "data":None,
            "msg":""}
    try:
        with get_db() as conn:
            with conn.cursor() as cursor:
                cursor.execute("""
                    SELECT
                    *
                    FROM t_category
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
            p.id AS "product_id",
            p.name,
            p.content,
            p.price,
            p.category_id,
            p.created_dt,

            u.id AS "user_id",
            u.username,

            c.name AS "category_name",

            COALESCE(
                json_agg(
                    json_build_object(
                        'id', pi.id,
                        'filepath', pi.filepath
                    )
                ) FILTER (WHERE pi.id IS NOT NULL),
                '[]'::json
            ) AS images

            FROM t_product AS p

            JOIN t_user AS u
                ON p.user_id = u.id

            JOIN t_category AS c
                ON c.id = p.category_id

            LEFT JOIN t_product_img AS pi
                ON pi.product_id = p.id

            WHERE p.id = %s

            GROUP BY
                p.id,
                p.name,
                p.price,
                p.category_id,
                p.created_dt,
                u.id,
                u.username,
                c.name
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
def upsert_product(name: str = Form("")
                   ,content: str = Form("")
                   ,price: str = Form("0")
                   ,category_id: str = Form("0")
                   ,product_id: str = Form("0")
                   # 빈 목록이면 이미지 미첨부. binary 명세로 Swagger 파일 선택 버튼을 표시합니다.
                   ,images: list[UploadFile] = File(
                       default=[],
                       json_schema_extra={"items": {"type": "string", "format": "binary"}}
                   )
                   ,credentials: HTTPAuthorizationCredentials 
                              | None = Security(bearer_scheme)):
    result={"success":True,
                "data":None,
                "msg":""}
    old_files = []
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

        # 파일을 선택하지 않았다면 이미지 관련 작업을 하지 않습니다.
        images = [img for img in (images or []) if img.filename]
        if len(images) > 5:
            raise Exception("이미지는 최대 5개까지 업로드할 수 있습니다.")
        for img in images:
            extension = Path(img.filename).suffix.lower()
            if extension not in (".jpg", ".jpeg", ".png", ".gif", ".webp"):
                raise Exception("jpg, jpeg, png, gif, webp 이미지만 업로드할 수 있습니다.")
            if not (img.content_type or "").startswith("image/"):
                raise Exception("이미지 파일만 업로드할 수 있습니다.")

        with get_db() as conn:
            with conn.cursor() as cursor:
                if product_id <= 0:
                    cursor.execute("""
                        INSERT INTO t_product
                        (name,price,user_id,category_id,content)
                        VALUES
                        (%s,%s,%s,%s,%s)
                        RETURNING id, name, price,category_id, created_dt, content
                    """
                        ,(name,price,user_id,category_id, content)
                    )
                else:
                    cursor.execute("""
                        UPDATE t_product
                        SET name=%s
                        ,content=%s
                        ,price=%s
                        ,category_id=%s
                        WHERE id=%s AND user_id=%s
                        RETURNING id, name, price, category_id, user_id,created_dt, content
                    """
                        ,(name,content,price,category_id,product_id,user_id)
                    )
                row=cursor.fetchone()
                if row is None:
                    raise Exception("상품이 없거나 수정 권한이 없습니다.")
                columns = [
                    desc[0]
                    for desc in cursor.description
                ]
                data = dict(zip(columns, row))
                data["created_dt"] = data["created_dt"].isoformat()

                if images:
                    product_id = data["id"]
                    # 기존 경로를 기억해 두고, DB에는 새 이미지 경로를 저장합니다.
                    cursor.execute("SELECT filepath FROM t_product_img WHERE product_id=%s",
                                   (product_id,))
                    old_files = [row[0] for row in cursor.fetchall()]
                    cursor.execute("DELETE FROM t_product_img WHERE product_id=%s",
                                   (product_id,))

                    data["images"] = []
                    for img in images:
                        filepath = upload_image(
                            file_name=img.filename,
                            content=img.file.read(),
                            content_type=img.content_type or "application/octet-stream",
                        )
                        cursor.execute("""
                            INSERT INTO t_product_img (product_id, filepath)
                            VALUES (%s, %s)
                        """, (product_id, filepath))
                        data["images"].append(filepath)

        result["data"]=data
    except Exception as e:
        # 오류가 발생하면 연결 컨텍스트가 DB 트랜잭션을 롤백합니다.
        result["success"]=False
        result["msg"]=str(e)
        return result

    # DB 저장이 성공한 뒤에만 기존 실제 파일을 삭제합니다.
    for filepath in old_files:
        if filepath and filepath.startswith("/public/products/"):
            path = PRODUCT_IMAGE_DIR / Path(filepath).name
            try:
                path.unlink(missing_ok=True)
            except OSError as e:
                print(f"기존 이미지 삭제 실패: {path.name}: {e}")
        
    return result

@router.delete("/delete_product")
def delete_product(id: str = "0",
                   credentials: HTTPAuthorizationCredentials | None = Security(bearer_scheme)):
    result = {"success": True, "data": None, "msg": ""}
    old_files = []
    try:
        if not credentials:
            raise Exception("토큰이 없습니다.")

        user_info = decode_access_token(credentials.credentials)
        if not user_info:
            raise Exception("유효하지 않은 토큰입니다.")

        product_id = int(id)
        with get_db() as conn:
            with conn.cursor() as cursor:
                cursor.execute(
                    "SELECT filepath FROM t_product_img WHERE product_id=%s",
                    (product_id,),
                )
                old_files = [row[0] for row in cursor.fetchall()]
                cursor.execute(
                    "DELETE FROM t_product WHERE id=%s AND user_id=%s RETURNING id",
                    (product_id, user_info["id"]),
                )
                if cursor.fetchone() is None:
                    raise Exception("삭제할 상품이 없거나 삭제 권한이 없습니다.")

        for filepath in old_files:
            if filepath and filepath.startswith("/public/products/"):
                (PRODUCT_IMAGE_DIR / Path(filepath).name).unlink(missing_ok=True)
    except Exception as e:
        result["success"] = False
        result["msg"] = str(e)

    return result
