import os
from pathlib import Path

import httpx
from dotenv import load_dotenv


PROJECT_DIR = Path(__file__).resolve().parent.parent
load_dotenv(PROJECT_DIR / ".env")

IMGBB_UPLOAD_URL = "https://api.imgbb.com/1/upload"
IMGBB_MAX_FILE_SIZE = 32 * 1024 * 1024


def upload_image(file_name: str, content: bytes, content_type: str) -> str:
    api_key = os.getenv("IMGBB_API_KEY")
    if not api_key:
        raise RuntimeError(".env 파일에 IMGBB_API_KEY를 설정해 주세요.")

    if not content:
        raise ValueError("빈 이미지 파일은 업로드할 수 없습니다.")
    if len(content) > IMGBB_MAX_FILE_SIZE:
        raise ValueError("이미지는 32MB 이하만 업로드할 수 있습니다.")

    try:
        response = httpx.post(
            IMGBB_UPLOAD_URL,
            params={"key": api_key},
            files={"image": (file_name, content, content_type)},
            timeout=30.0,
        )
        response.raise_for_status()
        payload = response.json()
    except httpx.HTTPStatusError as exc:
        try:
            error_message = exc.response.json().get("error", {}).get("message")
        except ValueError:
            error_message = None
        raise RuntimeError(
            f"ImgBB 업로드에 실패했습니다: {error_message or exc.response.text}"
        ) from exc
    except (httpx.RequestError, ValueError) as exc:
        raise RuntimeError(f"ImgBB 업로드 중 오류가 발생했습니다: {exc}") from exc

    image_url = payload.get("data", {}).get("url")
    if not payload.get("success") or not image_url:
        raise RuntimeError("ImgBB 응답에서 이미지 URL을 찾을 수 없습니다.")

    return image_url
