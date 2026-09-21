import os
from threading import Lock

from dotenv import load_dotenv
from psycopg_pool import ConnectionPool

load_dotenv()

_pool: ConnectionPool | None = None
_pool_lock = Lock()


def _get_pool() -> ConnectionPool:
    global _pool

    if _pool is None:
        with _pool_lock:
            if _pool is None:
                database_url = os.getenv("DATABASE_URL")
                if not database_url:
                    raise RuntimeError(
                        "DATABASE_URL environment variable is not configured."
                    )
                new_pool = ConnectionPool(
                    conninfo=database_url,
                    min_size=1,
                    max_size=10,
                    check=ConnectionPool.check_connection,
                    max_idle=300,
                    open=False,
                )
                new_pool.open()
                _pool = new_pool

    return _pool


def get_db():
    return _get_pool().connection()


def close_db_pool() -> None:
    global _pool

    if _pool is not None:
        _pool.close()
        _pool = None
