from psycopg_pool import ConnectionPool

pool= ConnectionPool(
    conninfo="""
        host=localhost
        port=5432
        dbname=postgres
        user=postgres
        password=aaaa
    """
    ,min_size=1
    ,max_size=10
)

def get_db():
    return pool.connection()