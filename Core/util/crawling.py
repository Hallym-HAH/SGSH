# crawling_modified.py
from bs4 import BeautifulSoup
import requests
import re
import time
import os
import urllib.request
import json
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium_stealth import stealth
from webdriver_manager.chrome import ChromeDriverManager
import pandas as pd
from dotenv import load_dotenv

try:
    load_dotenv()
    NAVER_API_ID = os.getenv("NAVER_API_ID")
    NAVER_API_SECRET = os.getenv("NAVER_API_SECRET")
except:
    pass

def crawl_articles(keyword, max_count=3, blogs=None):
    """
    키워드로 네이버 블로그를 크롤링하여 최대 max_count개의 글을 가져옴

    Args:
        keyword (str): 검색할 키워드
        max_count (int): 가져올 글의 최대 개수 (기본값: 3)
        blogs (str): 웹에서 전달 받은 블로그 주소

    Returns:
        list: 크롤링한 글 목록 (각 항목은 딕셔너리 형태)
    """
    options = webdriver.ChromeOptions()
    options.add_experimental_option("excludeSwitches", ["enable-automation"])
    options.add_experimental_option("useAutomationExtension", False)

    # Docker 컨테이너 환경용 헤드리스 모드 설정 추가
    options.add_argument("--headless")
    options.add_argument("--no-sandbox")
    options.add_argument("--disable-dev-shm-usage")
    options.add_argument("--disable-gpu")
    options.add_argument("--window-size=1920,1080")

    # 드라이버 초기화 부분 수정
    # try:
    #     # Docker 환경에서는 간단하게 설정
    #     driver = webdriver.Chrome(options=options)
    # except:
    #     # 로컬 개발 환경용 대체 방법
    #     driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    driver = webdriver.Chrome(service=Service(ChromeDriverManager().install()), options=options)

    # 스텔스 설정
    stealth(driver,
            languages=['en-US', 'en'],
            vendor='Google Inc.',
            platform='Win32',
            webgl_vendor='Intel Inc.',
            renderer='Intel Iris OpenGL Engine',
            fix_hairline=True)

    # Naver API key 입력
    client_id = NAVER_API_ID
    client_secret = NAVER_API_SECRET

    # 검색 결과 저장용 변수
    naver_urls = []
    postdate = []
    titles = []

    pattern1 = '<[^>]*>|\{[^}]*\}|\.pzp[\s\S]*?접기/펴기'

    if blogs == None:
        # 검색어 입력
        encText = urllib.parse.quote(keyword)

        # 검색 API 호출 (최대 max_count개만 가져오도록 설정)
        url = f"https://openapi.naver.com/v1/search/blog?query={encText}&start=1&display={max_count}"

        request = urllib.request.Request(url)
        request.add_header("X-Naver-Client-Id", client_id)
        request.add_header("X-Naver-Client-Secret", client_secret)

        response = urllib.request.urlopen(request)
        rescode = response.getcode()

        if rescode == 200:
            response_body = response.read()
            data = json.loads(response_body.decode('utf-8'))['items']

            pattern1 = '<[^>]*>|\{[^}]*\}|\.pzp[\s\S]*?접기/펴기'

            # 네이버 블로그 URL만 필터링
            for row in data:
                if 'blog.naver' in row['link']:
                    naver_urls.append(row['link'])
                    postdate.append(row['postdate'])

                    title = re.sub(pattern=pattern1, repl='', string=row['title'])
                    titles.append(title)

            # print(naver_urls)
            # 본문 크롤링
            contents = []
            # headers = {"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/98.0.4758.102"}

            try:
                for i in range(min(len(naver_urls), max_count)):
                    print(f"크롤링 중: {naver_urls[i]}")
                    driver.get(naver_urls[i])
                    time.sleep(5)  # 대기시간

                    iframe = driver.find_element(By.ID, "mainFrame")
                    driver.switch_to.frame(iframe)

                    source = driver.page_source
                    html = BeautifulSoup(source, "html.parser")

                    # 본문 추출
                    content = html.select("div.se-main-container")
                    content = ''.join(str(content))

                    # HTML 태그 제거 및 텍스트 다듬기
                    content = re.sub(pattern=pattern1, repl='', string=content)
                    pattern2 = """[\n\n\n\n\n// flash 오류를 우회하기 위한 함수 추가\nfunction _flash_removeCallback() {}"""
                    content = content.replace(pattern2, '')
                    content = content.replace('\n', '')
                    content = content.replace('\u200b', '')

                    contents.append(content)

                # 결과를 리스트로 묶기
                articles = []
                for i in range(min(len(contents), max_count)):
                    articles.append(contents[i])

                driver.quit()
                return articles

            except Exception as e:
                print(f"크롤링 중 오류 발생: {e}")
                driver.quit()
                return []
        else:
            print(f"API 요청 오류: {rescode}")
            return []

    else:
        contents = []
        naver_urls = blogs.split(',')
        print(naver_urls)

        try:
            for i in range(min(len(naver_urls), max_count)):
                print(f"크롤링 중: {naver_urls[i]}")
                driver.get(naver_urls[i])
                time.sleep(5)  # 대기시간

                iframe = driver.find_element(By.ID, "mainFrame")
                driver.switch_to.frame(iframe)

                source = driver.page_source
                html = BeautifulSoup(source, "html.parser")

                # 본문 추출
                content = html.select("div.se-main-container")
                content = ''.join(str(content))

                # HTML 태그 제거 및 텍스트 다듬기
                content = re.sub(pattern=pattern1, repl='', string=content)
                pattern2 = """[\n\n\n\n\n// flash 오류를 우회하기 위한 함수 추가\nfunction _flash_removeCallback() {}"""
                content = content.replace(pattern2, '')
                content = content.replace('\n', '')
                content = content.replace('\u200b', '')

                contents.append(content)

            print("여기다!")
            # 결과를 리스트로 묶기
            articles = []
            for i in range(min(len(contents), max_count)):
                articles.append(contents[i])

            driver.quit()
            return articles

        except Exception as e:
            print(f"크롤링 중 오류 발생: {e}")
            driver.quit()
            return []


if __name__ == "__main__":
    # 테스트용 실행
    keyword = input("검색할 키워드를 입력해주세요: ")
    articles = crawl_articles(keyword, max_count=3)
    print(f"크롤링된 글 개수: {len(articles)}")
    for i, article in enumerate(articles, 1):
        print(f"\n글 {i}:")
        print(f"본문 일부: {article[:100]}...")
