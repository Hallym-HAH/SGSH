from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware  # CORS 미들웨어 임포트

from util import information_extractor, keyword_extractor
from util import generator, crawling
import random
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
        platform: str = "인스타그램",
        use_info: bool = False,
        use_keyword: bool = False
):

    try:
        store_info = {
            'name': name,
            'address': address,
            'time': time,
            'number': number,
            'description': description
        }

        generated_content = main(store_info=store_info, platform=platform, max_items=10, use_info=use_info, use_keyword=use_keyword)

        return {
            "generated_content": generated_content
        }

    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def main(store_info, platform="인스타그램", max_items=10, use_info=False, use_keyword=False):

    articles = []
    generator_input = {
        "name": store_info['name'],
        "address": store_info['address'],
        "time": store_info['time'],
        "number": store_info['number'],
        "description": store_info['description'],
        "platform": platform,
    }

    if (use_info==True or use_keyword==True):
        articles = crawling.crawl_articles(keyword="춘천 "+store_info['name'], max_count=5)
        articles = random.sample(articles, k=3)

    if use_info:
        information_chain = information_extractor.extractor_information(articles=articles)
        generator_input["information"] = information_chain


    if use_keyword:
        keyword_chain = keyword_extractor.extractor_keywords(articles=articles, max_items=max_items)
        generator_input["keywords"] = keyword_chain

    # use_info와 use_keyword 파라미터 전달
    generator_chain = generator.generator_article(
        use_info=use_info,
        use_keyword=use_keyword
    )

    # 생성 결과 반환
    return generator_chain.invoke(generator_input).content
