from psycopg_pool import ConnectionPool

pool= ConnectionPool(
    conninfo="""postgresql://neondb_owner:npg_FCHZY8fP9WEJ@ep-winter-pond-au60y3ln-pooler.c-10.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"""
    ,min_size=1
    ,max_size=10
    # Neon이나 네트워크가 끊어서 죽은 연결을 풀에서 다시 사용하지 않도록 검사합니다.
    ,check=ConnectionPool.check_connection
    # 오래 사용하지 않은 연결은 닫고 필요할 때 새 연결을 만듭니다.
    ,max_idle=300
)

def get_db():
    return pool.connection()
