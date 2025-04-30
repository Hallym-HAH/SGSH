from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # CORS 미들웨어 임포트
from util import generator_basic
import os
from dotenv import load_dotenv

# 환경 변수 로드
try:
    load_dotenv()
except:
    pass

app = FastAPI()

# CORS 미들웨어 설정
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 모든 출처 허용
    allow_credentials=True,
    allow_methods=["*"],  # 모든 HTTP 메서드 허용
    allow_headers=["*"],  # 모든 HTTP 헤더 허용
)


@app.get("/generate")
async def realtime_generation(
        name: str,
        address: str,
        time: str,
        number: str,
        description: str,
        platform: str = "인스타그램"
):
    try:
        store_info = [name, address, time, number, description]

        generated_content = main(platform=platform, store_info=store_info)

        return {
            "generated_content": generated_content
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def main(store_info, platform="instagram"):
    generator_chain = generator_basic.generator_article()

    return generator_chain.invoke({
        "platform": platform,
        "name": store_info[0],
        "address": store_info[1],
        "time": store_info[2],
        "number": store_info[3],
        "description": store_info[4]
    }).content
