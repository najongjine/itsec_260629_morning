# FastAPI Shopping API

Vercel Python Runtime에서 실행되는 FastAPI 쇼핑몰 API입니다.

## Vercel Git Import 배포

1. 이 저장소를 GitHub, GitLab 또는 Bitbucket에 push합니다.
2. [Vercel New Project](https://vercel.com/new)에서 저장소를 **Import**합니다.
3. Framework Preset은 자동 감지된 **FastAPI**를 사용합니다. 현재 monorepo 기준 Root Directory는 `Fastapi/fastapi_202607_shopping`으로 지정하고 Build Command와 Output Directory는 비워 둡니다.
4. **Environment Variables**에 아래 값을 등록한 뒤 **Deploy**합니다.

| 환경 변수 | 설명 |
| --- | --- |
| `DATABASE_URL` | PostgreSQL/Neon 접속 문자열 |
| `IMGBB_API_KEY` | 상품 이미지 업로드용 ImgBB API 키 |
| `JWT_SECRET_KEY` | JWT 서명용 긴 랜덤 문자열 |
| `AES_KEY` | 16/24/32바이트 암호화 키 |

값은 `.env`를 Git에 올리지 말고 Vercel Project Settings에서 Production, Preview, Development 환경에 필요한 범위로 설정하세요. 기존 JWT와 암호화 데이터의 호환성을 유지하려면 `JWT_SECRET_KEY`와 `AES_KEY`를 배포 사이에 변경하지 마세요.

배포가 끝나면 다음 경로를 확인합니다.

- `/health`: Function 상태 확인
- `/docs`: Swagger UI
- `/redoc`: ReDoc

`main.py`의 `app` 인스턴스는 Vercel이 자동으로 탐지하며, Python 3.13과 Function 실행 시간은 저장소 설정 파일에 고정되어 있습니다. 상품 이미지는 Function의 임시 파일시스템이 아닌 ImgBB에 저장됩니다.

## 로컬 실행

`.env.example`을 `.env`로 복사하고 실제 값을 입력한 다음 실행합니다.

```bash
uv run uvicorn main:app --host 0.0.0.0 --port 7860 --reload
```

Vercel 운영 환경과 가깝게 확인하려면 Vercel CLI 48.1.8 이상에서 실행합니다.

```bash
vercel dev
```

Docker가 설치된 환경에서는 기존 방식도 계속 사용할 수 있습니다.

```bash
docker build -t fastapi-shopping .
docker run --rm -p 7860:7860 --env-file .env fastapi-shopping
```

API: <http://localhost:7860/docs>
