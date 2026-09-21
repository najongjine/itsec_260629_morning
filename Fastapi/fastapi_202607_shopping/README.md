---
title: FastAPI Shopping API
emoji: 🛍️
colorFrom: blue
colorTo: indigo
sdk: docker
app_port: 7860
pinned: false
---

# FastAPI Shopping API

Hugging Face Docker Space의 CPU 환경에서 실행되는 쇼핑몰 API입니다.

## Hugging Face 배포

1. Hugging Face에서 새 Space를 만들고 SDK로 **Docker**를 선택합니다.
2. 이 저장소의 파일을 Space 저장소에 push합니다.
3. Space의 **Settings → Variables and secrets → Secrets**에 아래 값을 등록합니다.

| Secret | 설명 |
| --- | --- |
| `DATABASE_URL` | PostgreSQL/Neon 접속 문자열 |
| `IMGBB_API_KEY` | 상품 이미지 업로드용 ImgBB API 키 |
| `JWT_SECRET_KEY` | JWT 서명용 긴 랜덤 문자열 |
| `AES_KEY` | 16/24/32바이트 암호화 키 |

기존 JWT와 암호화 데이터의 호환성을 유지하려면 `JWT_SECRET_KEY`와 `AES_KEY`를 배포 사이에 변경하지 마세요. CPU Basic 하드웨어는 Space의 **Settings → Hardware**에서 선택할 수 있습니다.

빌드가 끝나면 다음 경로로 상태를 확인할 수 있습니다.

- `/health`: 컨테이너 상태 확인
- `/docs`: Swagger UI
- `/redoc`: ReDoc

## 로컬 실행

`.env.example`을 `.env`로 복사하고 실제 값을 입력한 다음 실행합니다.

```bash
uv run uvicorn main:app --host 0.0.0.0 --port 7860 --reload
```

Docker가 설치된 환경에서는 다음과 같이 확인할 수 있습니다.

```bash
docker build -t fastapi-shopping .
docker run --rm -p 7860:7860 --env-file .env fastapi-shopping
```

API: <http://localhost:7860/docs>
