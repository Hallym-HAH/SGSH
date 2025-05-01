# -*- coding: utf-8 -*-

import os
from dotenv import load_dotenv
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate, PromptTemplate

load_dotenv()
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")


def generator_article(use_info=True, use_keyword=True):
    chat = ChatOpenAI(
        model="gpt-4o-mini",
        max_tokens=10000,
        temperature=0.4,
    )

    # 시스템 메시지 템플릿
    system_message = """
    당신은 매력적인 상점 콘텐츠를 작성하는 전문 카피라이터입니다.
    상단 노출 블로그/SNS 글의 핵심 키워드, 작문 스타일, 추출된 정보를 바탕으로 매력적인 글을 작성해주세요.
    """

    # 기본 템플릿 구성
    base_template = """
        다음 정보를 바탕으로 {platform}에 게시할 글을 공백 포함 400자 이내로 작성해주세요:
        
        가게 기본 정보:
        가게명 : {name}
        주소: {address}
        영업시간:{time}
        연락처: {number}
        가게 설명: {description}
    """

    # use_info 조건에 따라 information 섹션 추가
    if use_info:
        base_template += "\n\n글 정보:\n{information}"

    # use_keyword 조건에 따라 keywords 섹션 추가
    if use_keyword:
        base_template += "\n\n글 핵심 키워드\n{keywords}"

    # 세부 지침 시작
    base_template += "\n\n세부 지침"

    # use_keyword 조건에 따라 키워드 지침 추가
    if use_keyword:
        base_template += "\n- 제공된 키워드를 자연스럽게 포함시키되, 과도한 반복은 피하세요"
    else:
        base_template += "\n- 키워드를 자연스럽게 사용하세요"

    # 나머지 지침 추가
    base_template += """
        - 반드시 사실만을 작성하세요
        - 진정성 있고 신뢰할 수 있는 내용으로 작성하세요
        - 실제 경험에 근거한 것처럼 생생한 묘사를 포함하세요
        - 독자의 공감을 얻을 수 있는 감성적 요소를 추가하세요
        - 시각적으로 글이 매력적으로 보이도록 단락을 적절히 나누세요
        - 문장이 끝나면 한줄의 여백을 추가하세요.
        - 첫 문단은 아래의 가게 정보를 표시하세요. (가게 이름 앞에는 업종에 알맞은 이모티콘)(예를 들어 음식점은 🍽)
        {name}
        📍 주소: {address} 
        🕒 영업시간: {time}
        📞 연락처: {number}
        - 소개 글의 첫 문장은 가게에 대한 간단한 소개로 시작하세요. (숨겨진 보석 같은 문구 자제)
        - 마지막 줄은 항상 가게 정보와 관련된 해시태그 최소 5개를 포함하세요.

        이 글의 목표는 독자들이 실제로 상점을 방문하고 싶게 만드는 것입니다. 상점의 분위기와 특별함이 느껴지도록 생생하게 작성해주세요.
        """

    # ChatPromptTemplate 생성
    messages = ChatPromptTemplate.from_messages([
        ("system", system_message),
        ("human", base_template)
    ])

    # Chain 생성
    generator_chain = messages | chat

    return generator_chain


# def generator_article(store_info, articles=None, platform="instagram", use_info=False, use_keyword=False):
#     chat = ChatOpenAI(
#         model="gpt-4o-mini",
#         max_tokens=10000,
#         temperature=0.4,
#     )
#
#     # 시스템 메시지 템플릿
#     system_message = """
#         당신은 매력적인 상점 콘텐츠를 작성하는 전문 카피라이터입니다.
#         상단 노출 블로그/SNS 글의 핵심 키워드, 작문 스타일, 추출된 정보를 바탕으로 매력적인 글을 작성해주세요.
#         모든 문서를 동일한 중요도로 처리하고, 첫 번째 문서에 편향되지 않도록 주의하세요.
#         """
#
#     # 인간 메시지 템플릿
#     # human_message = """
#     #     다음 정보를 바탕으로 {platform}에 게시할 글을 공백 포함 400자 이내로 작성해주세요:
#     #
#     #     글 정보:
#     #     {information}
#     #
#     #     글 작문 스타일 참고
#     #     {style}
#     #
#     #     글 핵심 키워드
#     #     {keywords}
#     #
#     #     세부 지침
#     #     - 제공된 키워드({keywords})를 자연스럽게 포함시키되, 과도한 반복은 피하세요
#     #     - 스타일을 일관되게 유지하세요
#     #     - 진정성 있고 신뢰할 수 있는 내용으로 작성하세요
#     #     - 실제 경험에 근거한 것처럼 생생한 묘사를 포함하세요
#     #     - 독자의 공감을 얻을 수 있는 감성적 요소를 추가하세요
#     #     - 시각적으로 글이 매력적으로 보이도록 단락을 적절히 나누세요
#     #
#     #     이 글의 목표는 독자들이 실제로 상점을 방문하고 싶게 만드는 것입니다. 상점의 분위기와 특별함이 느껴지도록 생생하게 작성해주세요.
#     #     """
#
#     human_message = """
#             다음 정보를 바탕으로 {platform}에 게시할 가게 소개 글을 공백 포함 400자 이내로 작성해주세요:
#
#             글 정보:
#             {information}
#
#             글 핵심 키워드
#             {keywords}
#
#             세부 지침
#             - 제공된 키워드({keywords})를 자연스럽게 포함시키되, 과도한 반복은 피하세요
#             - 진정성 있고 신뢰할 수 있는 내용으로 작성하세요
#             - 실제 경험에 근거한 것처럼 생생한 묘사를 포함하세요
#             - 독자의 공감을 얻을 수 있는 감성적 요소를 추가하세요
#             - 단점에 대한 내용을 제외하세요.
#             - 시각적으로 글이 매력적으로 보이도록 단락을 적절히 나누세요
#             - 문장이 끝나면 한줄의 여백을 추가하세요.
#             - 첫 문단은 가게 정보를 표시하세요. (가게 이름 앞에는 업종에 알맞은 이모티콘)(예를 들어 음식점은 🍽)
#                 이름
#                 📍 주소:
#                 🕒 영업시간:
#                 📞 연락처:
#             - 마지막 줄은 항상 가게 정보와 관련된 해시태그 최대 10가지를 포함하세요.
#
#             이 글의 목표는 독자들이 실제로 상점을 방문하고 싶게 만드는 것입니다. 상점의 분위기와 특별함이 느껴지도록 생생하게 작성해주세요.
#             """
#
#     messages = ChatPromptTemplate.from_messages([
#         ("system", system_message),
#         ("human", human_message)
#     ])
#
#     generator_chain = messages | chat
#
#     return generator_chain

# # -*- coding: utf-8 -*-
#
# import os
# from dotenv import load_dotenv
# from langchain.chat_models import ChatOpenAI
# from langchain.prompts import ChatPromptTemplate, PromptTemplate
#
# load_dotenv()
# OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
#
# def generator_article(generate_info, articles=None, platform="instagram"):
#     chat = ChatOpenAI(
#         model="gpt-4o-mini",
#         max_tokens=10000,
#         temperature=0.4,
#     )
#
#     # 시스템 메시지 템플릿
#     system_message = """
#         당신은 매력적인 상점 콘텐츠를 작성하는 전문 카피라이터입니다.
#         상단 노출 블로그/SNS 글의 핵심 키워드, 작문 스타일, 추출된 정보를 바탕으로 매력적인 글을 작성해주세요.
#         모든 문서를 동일한 중요도로 처리하고, 첫 번째 문서에 편향되지 않도록 주의하세요.
#         """
#
#     # 인간 메시지 템플릿
#     # human_message = """
#     #     다음 정보를 바탕으로 {platform}에 게시할 글을 공백 포함 400자 이내로 작성해주세요:
#     #
#     #     글 정보:
#     #     {information}
#     #
#     #     글 작문 스타일 참고
#     #     {style}
#     #
#     #     글 핵심 키워드
#     #     {keywords}
#     #
#     #     세부 지침
#     #     - 제공된 키워드({keywords})를 자연스럽게 포함시키되, 과도한 반복은 피하세요
#     #     - 스타일을 일관되게 유지하세요
#     #     - 진정성 있고 신뢰할 수 있는 내용으로 작성하세요
#     #     - 실제 경험에 근거한 것처럼 생생한 묘사를 포함하세요
#     #     - 독자의 공감을 얻을 수 있는 감성적 요소를 추가하세요
#     #     - 시각적으로 글이 매력적으로 보이도록 단락을 적절히 나누세요
#     #
#     #     이 글의 목표는 독자들이 실제로 상점을 방문하고 싶게 만드는 것입니다. 상점의 분위기와 특별함이 느껴지도록 생생하게 작성해주세요.
#     #     """
#
#     human_message = """
#             다음 정보를 바탕으로 {platform}에 게시할 가게 소개 글을 공백 포함 400자 이내로 작성해주세요:
#
#             글 정보:
#             {information}
#
#             글 핵심 키워드
#             {keywords}
#
#             세부 지침
#             - 제공된 키워드({keywords})를 자연스럽게 포함시키되, 과도한 반복은 피하세요
#             - 진정성 있고 신뢰할 수 있는 내용으로 작성하세요
#             - 실제 경험에 근거한 것처럼 생생한 묘사를 포함하세요
#             - 독자의 공감을 얻을 수 있는 감성적 요소를 추가하세요
#             - 단점에 대한 내용을 제외하세요.
#             - 시각적으로 글이 매력적으로 보이도록 단락을 적절히 나누세요
#             - 문장이 끝나면 한줄의 여백을 추가하세요.
#             - 첫 문단은 가게 정보를 표시하세요. (가게 이름 앞에는 업종에 알맞은 이모티콘)(예를 들어 음식점은 🍽)
#                 이름
#                 📍 주소:
#                 🕒 영업시간:
#                 📞 연락처:
#             - 마지막 줄은 항상 가게 정보와 관련된 해시태그 최대 10가지를 포함하세요.
#
#             이 글의 목표는 독자들이 실제로 상점을 방문하고 싶게 만드는 것입니다. 상점의 분위기와 특별함이 느껴지도록 생생하게 작성해주세요.
#             """
#
#     messages = ChatPromptTemplate.from_messages([
#         ("system", system_message),
#         ("human", human_message)
#     ])
#
#     generator_chain = messages | chat
#
#     return generator_chain
#
