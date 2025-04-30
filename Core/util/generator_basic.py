# -*- coding: utf-8 -*-

import os
from dotenv import load_dotenv
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, PromptTemplate

try:
    load_dotenv()
except:
    pass

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

def generator_article():
    chat = ChatOpenAI(
        model="gpt-4o-mini",
        max_tokens=10000,
        temperature=0.4,
    )

    system_message = """
            당신은 매력적인 상점 콘텐츠를 작성하는 전문 카피라이터입니다.
            상단 노출 블로그/SNS 글의 핵심 키워드, 가게 정보를 바탕으로 매력적인 글을 작성해주세요.
            """

    human_message = """
            다음 정보를 바탕으로 {platform}에 게시할 글을 공백 포함 400자 이내로 작성해주세요:

            가게 정보:
            {name}  
            주소: {address} 
            영업시간: {time}
            연락처: {number}
            
            가게 설명:
            {description}

            세부 지침
            - 스타일을 일관되게 유지하세요
            - 진정성 있고 신뢰할 수 있는 내용으로 작성하세요
            - 실제 경험에 근거한 것처럼 생생한 묘사를 포함하세요
            - 독자의 공감을 얻을 수 있는 감성적 요소를 추가하세요
            - 시각적으로 글이 매력적으로 보이도록 단락을 적절히 나누세요
            - 문장이 끝나면 한줄의 여백을 추가하세요.
            - 첫 문단은 아래와 같은 가게 정보를 표시하세요. (가게 이름 앞에는 업종에 알맞은 이모티콘)(예를 들어 음식점은 🍽)
            {name}
            📍 주소: {address}
            🕒 영업시간: {time}
            📞 연락처: {number}
            - 소개 글의 첫 문장은 가게 분위기나 메뉴에 대한 소개로 시작하세요.
            - 마지막 줄은 항상 가게 정보와 관련된 해시태그 최소 5개를 포함하세요.
            
            이 글의 목표는 독자들이 실제로 상점을 방문하고 싶게 만드는 것입니다. 상점의 분위기와 특별함이 느껴지도록 생생하게 작성해주세요.
            """

    messages = ChatPromptTemplate.from_messages([
        ("system", system_message),
        ("human", human_message)
    ])

    print("글 생성 중...")

    generator_chain = messages | chat

    return generator_chain

