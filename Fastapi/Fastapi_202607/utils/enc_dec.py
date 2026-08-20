from pwdlib import PasswordHash
from cryptography.fernet import Fernet
import hashlib
import hmac
import base64
from Crypto.Cipher import AES
"""
단반향 암호화 (비밀번호용)
"""
password_hash=PasswordHash.recommended()


def hash_password(password:str) -> str:
    """
    비밀번호를 단방향 해시합니다.

    parameter:
        password (str): 사용자가 입력한 평문 비밀번호.

    returns:
        str: Argon2 라는 사람이 만든방식의 암호화된 비밀번호
    """
    return password_hash.hash(password)

def verify_password(plain_password:str
                    ,hashed_password:str) -> bool:
    """
    입력한 비밀번호가 암호화된거랑 일치하는지 검증.

    parameter:
        plain_password (str): 사용자가 입력한 평문 비밀번호.

        hashed_password (str): 암호화된 비밀번호.

    returns:
        bool.
    """
    return password_hash.verify(plain_password
                                ,hashed_password)



"""
양방향 암호화
"""
AES_KEY = b"12345678901234567890123456789012"
