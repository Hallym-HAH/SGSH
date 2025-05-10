# sales_analyzer.py
import os
from dotenv import load_dotenv
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

# 데이터 분석 함수 임포트
from util.sales_preprocessing import analyze_sales_data, get_sample_data

# 환경 변수 로드
try:
    load_dotenv()
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
except:
    pass


def analyze_sales_with_llm(analysis_result, analysis_type="daily"):
    """
    분석 결과를 받아 LLM을 통해 인사이트와 솔루션을 제공합니다.

    Parameters:
    analysis_result: analyze_sales_data 함수의 반환값
    analysis_type: 분석 유형 ('daily', 'weekly', 'monthly' 중 하나)

    Returns:
    AI 모델이 제공한 매출 분석 및 솔루션
    """
    # 모델 설정
    chat = ChatOpenAI(
        model="gpt-4o-mini",
        max_tokens=10000,
        temperature=0.3,
    )

    # 시스템 메시지 템플릿
    system_message = """
    당신은 소상공인과 자영업자를 위한 매출 분석 전문가입니다.
    제공된 {analysis_type} 매출 데이터를 분석하고 구체적인 솔루션을 제시해주세요.

    다음 가이드라인을 따라 분석해주세요:
    1. 데이터 기반의 객관적 분석을 제공할 것
    2. 수치적 인사이트와 함께 실행 가능한 제안을 제시할 것
    3. 매출 향상을 위한 단기 및 중장기 전략을 구분하여 제안할 것
    4. 고객 행동 패턴과 관련된 인사이트를 도출할 것
    """

    # 일별 분석 프롬프트
    if analysis_type == "daily":
        human_message = """
        ## 일별 매출 분석 요청

        다음 일별 매출 데이터를 분석하고 개선 방안을 제시해주세요:

        ### 매출 데이터
        {formatted_data}

        ### 요청사항
        1. 매출 요약 및 주요 지표 분석
        2. 시간대별 매출 패턴 분석
        3. 인기 메뉴 및 메뉴 조합 분석
        4. 개선을 위한 구체적인 액션 아이템 5가지
        5. 내일의 매출 증대를 위한 즉각적인 조치 3가지
        """
    # 주간/월간 분석 프롬프트는 생략 (원본과 동일)

    # 프롬프트 템플릿 생성
    messages = ChatPromptTemplate.from_messages([
        ("system", system_message),
        ("human", human_message)
    ])

    # 데이터 포맷팅
    formatted_data = format_analysis_result(analysis_result, analysis_type)

    # 분석 실행
    print(f"{analysis_type} 매출 분석 중...")

    analysis_result_messages = messages.format_messages(
        analysis_type=analysis_type,
        formatted_data=formatted_data
    )

    response = chat(analysis_result_messages)

    print(f"{analysis_type} 매출 분석 완료!")

    return response.content


def format_analysis_result(analysis_result, analysis_type):
    """
    sales_analysis.py 모듈의 analyze_sales_data() 함수 결과를
    LLM 프롬프트에 적합한 형태로 변환합니다.
    """
    if analysis_type == "daily":
        # 오늘 매출 데이터 추출
        sales = analysis_result['sales']['today']
        top_menus = analysis_result['today_top_menus']
        sales_by_time = analysis_result['today_sales_by_time']
        top_combos = analysis_result['today_top_combos']

        # 시간대별 매출 비율 계산 (임의 예시)
        total_time_sales = sum(sales_by_time)
        morning_sales = sum(sales_by_time[0:4])  # 8-12시
        afternoon_sales = sum(sales_by_time[4:9])  # 12-17시
        evening_sales = sum(sales_by_time[9:])  # 17-20시

        formatted_text = f"""
        ## 기본 매출 정보
        - 일일 총매출: {sales:,}원
        - 거래 건수: {len(analysis_result['today_orders'])}건

        ## 시간대별 매출
        - 오전(8-12시): {morning_sales:,}원 ({morning_sales / total_time_sales * 100:.1f}%)
        - 오후(12-17시): {afternoon_sales:,}원 ({afternoon_sales / total_time_sales * 100:.1f}%)
        - 저녁(17-20시): {evening_sales:,}원 ({evening_sales / total_time_sales * 100:.1f}%)

        ## 인기 메뉴 TOP 5
        {format_top_items(top_menus)}

        ## 인기 메뉴 조합 TOP 5
        {format_top_items(top_combos) if top_combos else "데이터 없음"}

        ## 시간대별 매출 상세
        {format_sales_by_hour(sales_by_time)}
        """

    # 주간/월간 포맷팅은 생략 (비슷한 방식으로 구현)

    return formatted_text


def format_top_items(items_list):
    """인기 아이템 목록을 포맷팅"""
    result = ""
    for i, (item, value) in enumerate(items_list, 1):
        result += f"  {i}. {item}: {value:,}개\n"
    return result


def format_sales_by_hour(sales_by_time):
    """시간대별 매출을 포맷팅"""
    result = ""
    for i, sales in enumerate(sales_by_time, 8):  # 8시부터 시작
        result += f"  - {i}시: {sales:,}원\n"
    return result


# 메인 실행 코드
def main():
    # 샘플 데이터 가져오기
    sample_data = get_sample_data()

    # 데이터 분석 함수 호출 (임포트한 함수 사용)
    analysis_result = analyze_sales_data(
        sample_data["sta"],
        sample_data["t_od"],
        sample_data["w_od"],
        sample_data["m_od"],
        sample_data["t_sts"],
        sample_data["w_sts"],
        sample_data["m_sts"]
    )

    # LLM을 통한 일별 매출 분석
    daily_analysis = analyze_sales_with_llm(analysis_result, "daily")
    print("\n=== 일별 매출 분석 결과 ===")
    print(daily_analysis)

    # 주간/월간 분석은 필요에 따라 추가


if __name__ == "__main__":
    main()
