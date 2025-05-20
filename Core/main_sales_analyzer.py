from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from typing import Optional
import os
from dotenv import load_dotenv
from langchain.chat_models import ChatOpenAI
from langchain.prompts import ChatPromptTemplate

# 데이터 분석 함수 임포트
from util.sales_preprocessing import analyze_sales_data

# 환경 변수 로드
try:
    load_dotenv()
    OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")
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


@app.get("/analyze_sales")
async def analyze_sales(
        sta: str,
        t_od: str,
        w_od: str,
        m_od: str,
        t_sts: str,
        w_sts: str,
        m_sts: str,
        analysis_type: Optional[str] = "daily"
):
    """
    매출 데이터를 분석하고 인사이트를 제공하는 API 엔드포인트

    Parameters:
    - sta: "123_456_789" 형태의 문자열 (오늘 매출, 이번 주 매출, 이번 달 매출)
    - t_od: 오늘 주문 목록 ("id_name_price_count-id_name2_price2_count2" 형태)
    - w_od: 이번 주 주문 목록
    - m_od: 이번 달 주문 목록
    - t_sts: 오늘 시간대별 매출 ("2000_3000_4500_..._9000" 형태)
    - w_sts: 이번 주 시간대별 매출
    - m_sts: 이번 달 시간대별 매출
    - analysis_type: 분석 유형 ('daily', 'weekly', 'monthly' 중 하나, 기본값은 'daily')
    """
    try:
        # 데이터 분석 함수 호출
        analysis_result = analyze_sales_data(sta, t_od, w_od, m_od, t_sts, w_sts, m_sts)

        # LLM을 통한 분석
        analysis_content = analyze_sales_with_llm(analysis_result, analysis_type)

        # 결과 반환
        return {
            "analysis_type": analysis_type,
            "analysis_content": analysis_content
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def analyze_sales_with_llm(analysis_result, analysis_type="daily"):
    """
    분석 결과를 받아 LLM을 통해 인사이트와 솔루션을 제공합니다.
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
    elif analysis_type == "weekly":
        human_message = """
        ## 주간 매출 분석 요청

        다음 주간 매출 데이터를 분석하고 개선 방안을 제시해주세요:

        ### 매출 데이터
        {formatted_data}

        ### 요청사항
        1. 주간 매출 요약 및 트렌드 분석
        2. 요일별 매출 패턴 분석
        3. 인기 메뉴 변화 추이 분석
        4. 다음 주 매출 증대를 위한 중기 전략 5가지
        5. 메뉴 가격 최적화 제안
        """
    else:  # monthly
        human_message = """
        ## 월간 매출 분석 요청

        다음 월간 매출 데이터를 분석하고 개선 방안을 제시해주세요:

        ### 매출 데이터
        {formatted_data}

        ### 요청사항
        1. 월간 매출 요약 및 추세 분석
        2. 주차별 매출 패턴 분석
        3. 계절적 요인과 매출의 상관관계 분석
        4. 장기적 비즈니스 전략 제안 (3-6개월)
        5. 메뉴 개편 및 마케팅 전략 제안
        """

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


# def format_analysis_result(analysis_result, analysis_type):
#     """
#     분석 결과를 LLM 프롬프트에 적합한 형태로 변환합니다.
#     """
#     if analysis_type == "daily":
#         # 오늘 매출 데이터 추출
#         sales = analysis_result['sales']['today']
#         top_menus = analysis_result['today_top_menus']
#         sales_by_time = analysis_result['today_sales_by_time']
#         top_combos = analysis_result['today_top_combos']
#
#         # 시간대별 매출 비율 계산
#         total_time_sales = sum(sales_by_time)
#         morning_sales = sum(sales_by_time[0:4])  # 8-12시
#         afternoon_sales = sum(sales_by_time[4:9])  # 12-17시
#         evening_sales = sum(sales_by_time[9:])  # 17-20시
#
#         formatted_text = f"""
#         ## 기본 매출 정보
#         - 일일 총매출: {sales:,}원
#         - 거래 건수: {len(analysis_result['today_orders'])}건
#
#         ## 시간대별 매출
#         - 오전(8-12시): {morning_sales:,}원 ({morning_sales / total_time_sales * 100:.1f}%)
#         - 오후(12-17시): {afternoon_sales:,}원 ({afternoon_sales / total_time_sales * 100:.1f}%)
#         - 저녁(17-20시): {evening_sales:,}원 ({evening_sales / total_time_sales * 100:.1f}%)
#
#         ## 인기 메뉴 TOP 5
#         {format_top_items(top_menus)}
#
#         ## 인기 메뉴 조합 TOP 5
#         {format_top_items(top_combos) if top_combos else "데이터 없음"}
#
#         ## 시간대별 매출 상세
#         {format_sales_by_hour(sales_by_time)}
#         """
#     elif analysis_type == "weekly":
#         # 주간 매출 데이터 추출
#         sales = analysis_result['sales']['week']
#         top_menus = analysis_result.get('week_top_menus', [])
#         sales_by_time = analysis_result.get('week_sales_by_time', [])
#
#         formatted_text = f"""
#         ## 기본 매출 정보
#         - 주간 총매출: {sales:,}원
#         - 주간 거래 건수: {len(analysis_result['week_orders'])}건
#
#         ## 인기 메뉴 TOP 5
#         {format_top_items(top_menus) if top_menus else "데이터 없음"}
#
#         ## 시간대별 매출 상세
#         {format_sales_by_hour(sales_by_time) if sales_by_time else "데이터 없음"}
#         """
#     else:  # monthly
#         # 월간 매출 데이터 추출
#         sales = analysis_result['sales']['month']
#         top_menus = analysis_result.get('month_top_menus', [])
#         sales_by_time = analysis_result.get('month_sales_by_time', [])
#
#         formatted_text = f"""
#         ## 기본 매출 정보
#         - 월간 총매출: {sales:,}원
#         - 월간 거래 건수: {len(analysis_result['month_orders'])}건
#
#         ## 인기 메뉴 TOP 5
#         {format_top_items(top_menus) if top_menus else "데이터 없음"}
#
#         ## 시간대별 매출 상세
#         {format_sales_by_hour(sales_by_time) if sales_by_time else "데이터 없음"}
#         """
#
#     return formatted_text

def format_analysis_result(analysis_result, analysis_type):
    """
    분석 결과를 LLM 프롬프트에 적합한 형태로 변환합니다.
    """
    if analysis_type == "daily":
        # 오늘 매출 데이터 추출
        sales = analysis_result['sales']['today']
        orders = analysis_result['today_orders']
        top_menus = analysis_result['today_top_menus']
        sales_by_time = analysis_result['today_sales_by_time']
        top_combos = analysis_result['today_top_combos']
        combo_sales = analysis_result['today_combo_sales']
        patterns = analysis_result['today_patterns']

        # 시간대별 매출 비율 계산
        total_time_sales = sum(sales_by_time)
        morning_sales = sum(sales_by_time[0:4])  # 8-12시
        afternoon_sales = sum(sales_by_time[4:9])  # 12-17시
        evening_sales = sum(sales_by_time[9:])  # 17-20시

        formatted_text = f"""
        ## 기본 매출 정보
        - 일일 총매출: {sales:,}원
        - 거래 건수: {len(orders)}건
        
        ## 시간대별 매출 분포
        - 오전(8-12시): {morning_sales:,}원 ({morning_sales / total_time_sales * 100:.1f}%)
        - 오후(12-17시): {afternoon_sales:,}원 ({afternoon_sales / total_time_sales * 100:.1f}%)
        - 저녁(17-20시): {evening_sales:,}원 ({evening_sales / total_time_sales * 100:.1f}%)
        
        ## 인기 메뉴 TOP 5
        {format_top_items(top_menus)}
        
        ## 인기 메뉴 조합 TOP 5
        {format_top_combos(top_combos) if top_combos else "데이터 없음"}
        
        ## 메뉴 조합별 매출 TOP 5
        {format_combo_sales(combo_sales) if combo_sales else "데이터 없음"}
        
        ## 시간대별 매출 상세
        {format_sales_by_hour(sales_by_time)}
        
        ## 패턴 분석 (주요 메뉴 조합)
        {format_patterns(patterns) if len(patterns) > 0 else "충분한 데이터가 없습니다."}
        """

    elif analysis_type == "weekly":
        # 주간 매출 데이터 추출
        sales = analysis_result['sales']['week']
        orders = analysis_result['week_orders']
        top_menus = analysis_result['week_top_menus']
        sales_by_time = analysis_result['week_sales_by_time']
        top_combos = analysis_result['week_top_combos']
        combo_sales = analysis_result['week_combo_sales']
        patterns = analysis_result['week_patterns']

        formatted_text = f"""
        ## 기본 매출 정보
        - 주간 총매출: {sales:,}원
        - 주간 거래 건수: {len(orders)}건
        
        ## 인기 메뉴 TOP 5
        {format_top_items(top_menus)}
        
        ## 인기 메뉴 조합 TOP 5
        {format_top_combos(top_combos) if top_combos else "데이터 없음"}
        
        ## 메뉴 조합별 매출 TOP 5
        {format_combo_sales(combo_sales) if combo_sales else "데이터 없음"}
        
        ## 시간대별 매출 상세
        {format_sales_by_hour(sales_by_time)}
        
        ## 패턴 분석 (주요 메뉴 조합)
        {format_patterns(patterns) if len(patterns) > 0 else "충분한 데이터가 없습니다."}
        """

    else:  # monthly
        # 월간 매출 데이터 추출
        sales = analysis_result['sales']['month']
        orders = analysis_result['month_orders']
        top_menus = analysis_result['month_top_menus']
        sales_by_time = analysis_result['month_sales_by_time']
        top_combos = analysis_result['month_top_combos']
        combo_sales = analysis_result['month_combo_sales']
        patterns = analysis_result['month_patterns']

        formatted_text = f"""
        ## 기본 매출 정보
        - 월간 총매출: {sales:,}원
        - 월간 거래 건수: {len(orders)}건
        
        ## 인기 메뉴 TOP 5
        {format_top_items(top_menus)}
        
        ## 인기 메뉴 조합 TOP 5
        {format_top_combos(top_combos) if top_combos else "데이터 없음"}
        
        ## 메뉴 조합별 매출 TOP 5
        {format_combo_sales(combo_sales) if combo_sales else "데이터 없음"}
        
        ## 시간대별 매출 상세
        {format_sales_by_hour(sales_by_time)}
        
        ## 패턴 분석 (주요 메뉴 조합)
        {format_patterns(patterns) if len(patterns) > 0 else "충분한 데이터가 없습니다."}
        """

    return formatted_text


def format_top_combos(combos_list):
    """인기 메뉴 조합을 포맷팅"""
    result = ""
    for i, ((menu1, menu2), count) in enumerate(combos_list, 1):
        result += f" {i}. {menu1} + {menu2}: {count:,}회\n"
    return result


def format_combo_sales(combo_sales_list):
    """메뉴 조합별 매출을 포맷팅"""
    result = ""
    for i, ((menu1, menu2), sales) in enumerate(combo_sales_list, 1):
        result += f" {i}. {menu1} + {menu2}: {sales:,}원\n"
    return result


def format_patterns(patterns_df):
    """패턴 분석 결과를 포맷팅"""
    if len(patterns_df) == 0:
        return "충분한 데이터가 없습니다."

    result = ""
    for i, row in patterns_df.head(3).iterrows():
        itemset_str = ', '.join(list(row['itemsets']))
        result += f" {i + 1}. {itemset_str}\n"
        result += f"    - 지지도: {row['support']:.3f}\n"
        result += f"    - 주문 횟수: {row['order_count']}회\n"
        result += f"    - 총 매출: {row['total_sales']:,}원\n"

    return result


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


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
