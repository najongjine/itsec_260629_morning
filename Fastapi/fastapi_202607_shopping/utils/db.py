from psycopg_pool import ConnectionPool

pool= ConnectionPool(
    conninfo="""postgresql://neondb_owner:npg_FCHZY8fP9WEJ@ep-winter-pond-au60y3ln-pooler.c-10.us-east-1.aws.neon.tech/neondb?channel_binding=require&sslmode=require"""
    ,min_size=1
    ,max_size=10
)

def get_db():
    return pool.connection()