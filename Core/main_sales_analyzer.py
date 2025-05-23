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
        analysis_content = analyze_sales_with_llm(analysis_result)

        # 결과 반환
        return {
            "analysis_type": analysis_type,
            "analysis_content": analysis_content
        }
    except HTTPException as he:
        raise he
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


# def analyze_sales_with_llm(analysis_result, analysis_type="daily"):
#     """
#     분석 결과를 받아 LLM을 통해 인사이트와 솔루션을 제공합니다.
#     """
#     # 모델 설정
#     chat = ChatOpenAI(
#         model="gpt-4o-mini",
#         max_tokens=30000,
#         temperature=0.3,
#     )
#
#     # 시스템 메시지 템플릿
#     # 개선된 시스템 메시지
#     system_message = """
#     당신은 MBA와 데이터 사이언스 박사 학위를 보유한 최고급 비즈니스 인텔리전스 전문가입니다.
#     제공된 {analysis_type} 매출 데이터를 심층적으로 분석하여 경영진이 즉시 활용할 수 있는 고급 인사이트와 전략적 액션 아이템을 제공해주세요.
#
#     분석 지침:
#     1. 각 분석 항목은 반드시 최소 500자 이상의 상세한 내용을 포함해야 합니다.
#     2. 매출 데이터의 표면적 현상뿐만 아니라 근본 원인과 숨겨진 패턴을 발견하여 제시하세요.
#     3. 모든 분석에 정량적 수치(%, 증감률, 상관관계 등)를 포함하고, 이를 비즈니스 컨텍스트와 연결하세요.
#     4. 경쟁업체 벤치마킹과 산업 표준을 고려한 비교 분석을 제공하세요.
#     5. 단기/중기/장기 관점에서 단계적으로 실행 가능한 전략을 제시하세요.
#     6. 고객 심리, 행동 경제학, 트렌드 분석을 통합하여 다차원적 인사이트를 도출하세요.
#     """
#
#     # 일별 분석 프롬프트
#     if analysis_type == "daily":
#         human_message = """
#         ## 일별 매출 분석 요청
#
#         다음 일별 매출 데이터를 심층적으로 분석하고 실행 가능한 개선 방안을 제시해주세요:
#
#         ### 매출 데이터
#         {formatted_data}
#
#         ### 요청사항
#         - 매출 요약: 핵심 매출 지표 분석, 목표 대비 성과, 주요 성공/실패 요인 (최소 500자)
#         - 시간대별 패턴: 피크 타임 분석, 고객 유형별 방문 패턴, 시간대별 객단가 변화 (최소 500자)
#         - 인기 메뉴 분석: 메뉴별 기여도, 수익성 분석, 교차판매 기회 발굴 (최소 500자)
#         - 개선 액션 5가지: ROI 기반 우선순위화된 전략적 액션 아이템 상세 설명 (최소 500자)
#         - 즉각 조치 3가지: 24시간 내 실행 가능한 고영향 전술적 액션 아이템 (최소 500자)
#         """
#
#     # 주별 분석 프롬프트
#     elif analysis_type == "weekly":
#         human_message = """
#         ## 주간 매출 분석 요청
#
#         다음 주간 매출 데이터를 심층적으로 분석하고 실행 가능한 개선 방안을 제시해주세요:
#
#         ### 매출 데이터
#         {formatted_data}
#
#         ### 요청사항
#         1. 주간 매출 요약: 주간 핵심 매출 지표, 전주 대비 성과, 월간 목표 달성 현황 (최소 500자)
#         2. 요일별 매출 패턴: 요일별 매출 분포, 피크 요일 분석, 요일별 고객 행동 패턴 (최소 500자)
#         3. 주간 인기 메뉴: 주간 베스트셀러, 요일별 인기 메뉴 변화, 이익 기여도 분석 (최소 500자)
#         4. 이번 주 개선점: 주간 성과 기반 개선 필요 영역, 기회 및 위험 요소 심층 분석 (최소 500자)
#         5. 다음 주 전략 제안: 다음 주 성과 향상을 위한 전략적 계획, 자원 배분, KPI 설정 (최소 500자)
#         """
#
#     # 월별 분석 프롬프트
#     else:  # monthly
#         human_message = """
#         ## 월간 매출 분석 요청
#
#         다음 월간 매출 데이터를 심층적으로 분석하고 실행 가능한 개선 방안을 제시해주세요:
#
#         ### 매출 데이터
#         {formatted_data}
#
#         ### 요청사항
#         1. 월간 매출 요약: 월간 핵심 성과 지표, 전월/전년 동월 대비 성과, 연간 목표 진행 상황 (최소 500자)
#         2. 주차별 매출 패턴: 주별 매출 추이, 성장/하락 요인 분석, 월간 사이클 패턴 식별 (최소 500자)
#         3. 월간 인기 메뉴: 메뉴 포트폴리오 분석, 계절적 트렌드, 메뉴 수익성 및 회전율 분석 (최소 500자)
#         4. 이번 달 개선점: 경쟁사 벤치마킹, 운영 효율성 평가, 고객 만족도 및 LTV 분석 (최소 500자)
#         5. 다음 달 전략 제안: 다음 달 전술적/전략적 목표, 마케팅 캘린더, 메뉴 최적화 계획 (최소 500자)
#         """
#
    # # 요청사항 공통 개선 부분
    # detailed_analysis_instructions = """
    #
    # 각 분석 항목에 대해 다음 요소를 포함한 최소 500자 이상의 상세 분석을 제공하세요:
    #
    # 1. 데이터 요약: 핵심 수치와 KPI를 명확하게 제시
    # 2. 트렌드 분석: 시계열적 패턴과 변동성 분석
    # 3. 세그먼트 분석: 다양한 차원(시간, 메뉴, 고객 등)에서의 성과 분석
    # 4. 인과관계 분석: 특정 현상의 원인과 영향 요인 규명
    # 5. 벤치마킹: 업계 표준 및 경쟁사와의 비교
    # 6. 예측 모델링: 현재 추세에 기반한 향후 전망
    # 7. 액션 아이템: 구체적이고 측정 가능한 추천 사항
    # 8. 리스크 분석: 잠재적 위험 요소와 완화 방안
    #
    # 각 항목은 최소 500자, 가능하면 700-800자 수준으로 작성하여 충분한 깊이와 통찰력을 제공하세요.
    # """
    #
    # # 출력 형식 지침
    # output_format_instructions = """
    #
    # 각 요청 사항에 대한 결과는 다음 형태로 출력하세요:
    # ### [항목 제목]
    # [이곳에 최소 500자 이상의 상세 분석 내용이 들어갑니다. 단락을 나누어 가독성을 높이고, 수치와 구체적인 예시를 풍부하게 포함하세요.]
    #
    # 출력 형식 외의 다른 내용을 절대 포함하지 마세요.
    # 분석을 시작하기 전에, 각 섹션에서 최소 500자 이상의 충실한 내용을 작성할 것을 다시 한번 상기하세요.
    # """
    #
    # human_message += detailed_analysis_instructions
    # human_message += output_format_instructions

def analyze_sales_with_llm(analysis_result):
    """
    분석 결과를 받아 LLM을 통해 일별, 주별, 월별 인사이트와 솔루션을 모두 제공합니다.
    """
    # 모델 설정
    chat = ChatOpenAI(
        model="gpt-4o-mini",
        max_tokens=16000,
        temperature=0.3,
    )

    # 시스템 메시지 템플릿
    system_message = """
    당신은 MBA와 데이터 사이언스 박사 학위를 보유한 최고급 비즈니스 인텔리전스 전문가입니다.
    제공된 일별, 주별, 월별 매출 데이터를 심층적으로 분석하여 경영진이 즉시 활용할 수 있는 고급 인사이트와 전략적 액션 아이템을 제공해주세요.

    분석 지침:
    1. 각 분석 항목은 반드시 최소 500자 이상의 상세한 내용을 포함해야 합니다.
    2. 매출 데이터의 표면적 현상뿐만 아니라 근본 원인과 숨겨진 패턴을 발견하여 제시하세요.
    3. 모든 분석에 정량적 수치(%, 증감률, 상관관계 등)를 포함하고, 이를 비즈니스 컨텍스트와 연결하세요.
    4. 경쟁업체 벤치마킹과 산업 표준을 고려한 비교 분석을 제공하세요.
    5. 단기/중기/장기 관점에서 단계적으로 실행 가능한 전략을 제시하세요.
    6. 고객 심리, 행동 경제학, 트렌드 분석을 통합하여 다차원적 인사이트를 도출하세요.
    """

    # 통합된 프롬프트 작성
    # 통합된 프롬프트 작성 - 항목별로 일/주/월 분석을 함께 제시
    human_message = """
    ## 종합 매출 분석 요청

    다음 매출 데이터를 심층적으로 분석하고 실행 가능한 개선 방안을 제시해주세요:

    ### 매출 데이터
    {formatted_data}

    ### 요청사항

    ### 매출 요약
    - 일 매출: 일일 핵심 매출 지표 분석, 목표 대비 성과, 주요 성공/실패 요인
    - 주 매출: 주간 핵심 매출 지표, 전주 대비 성과, 월간 목표 달성 현황
    - 월 매출: 월간 핵심 성과 지표, 전월/전년 동월 대비 성과, 연간 목표 진행 상황

    ### 시간/요일/주차별 패턴
    - 일별 시간대 패턴: 피크 타임 분석, 고객 유형별 방문 패턴, 시간대별 객단가 변화
    - 주간 요일별 패턴: 요일별 매출 분포, 피크 요일 분석, 요일별 고객 행동 패턴
    - 월간 주차별 패턴: 주별 매출 추이, 성장/하락 요인 분석, 월간 사이클 패턴 식별

    ### 인기 메뉴 분석
    - 일별 인기 메뉴: 메뉴별 기여도, 수익성 분석, 교차판매 기회 발굴
    - 주간 인기 메뉴: 주간 베스트셀러, 요일별 인기 메뉴 변화, 이익 기여도 분석
    - 월간 인기 메뉴: 메뉴 포트폴리오 분석, 계절적 트렌드, 메뉴 수익성 및 회전율 분석

    ### 개선점 분석
    - 일별 개선 액션: ROI 기반 우선순위화된 전략적 액션 아이템 5가지 상세 설명
    - 주간 개선점: 주간 성과 기반 개선 필요 영역, 기회 및 위험 요소 심층 분석
    - 월간 개선점: 경쟁사 벤치마킹, 운영 효율성 평가, 고객 만족도 및 LTV 분석

    ### 향후 전략 제안
    - 일별 즉각 조치: 24시간 내 실행 가능한 고영향 전술적 액션 아이템 3가지
    - 주간 전략 제안: 다음 주 성과 향상을 위한 전략적 계획, 자원 배분, KPI 설정
    - 월간 전략 제안: 다음 달 전술적/전략적 목표, 마케팅 캘린더, 메뉴 최적화 계획
    """

    # 요청사항 공통 개선 부분
    detailed_analysis_instructions = """

    각 분석 항목에 대해 다음 요소를 포함한 최소 500자 이상의 상세 분석을 제공하세요:

    1. 데이터 요약: 핵심 수치와 KPI를 명확하게 제시
    2. 트렌드 분석: 시계열적 패턴과 변동성 분석
    3. 세그먼트 분석: 다양한 차원(시간, 메뉴, 고객 등)에서의 성과 분석
    4. 인과관계 분석: 특정 현상의 원인과 영향 요인 규명
    5. 벤치마킹: 업계 표준 및 경쟁사와의 비교
    6. 예측 모델링: 현재 추세에 기반한 향후 전망
    7. 액션 아이템: 구체적이고 측정 가능한 추천 사항
    8. 리스크 분석: 잠재적 위험 요소와 완화 방안

    각 항목은 최소 500자, 가능하면 700-800자 수준으로 작성하여 충분한 깊이와 통찰력을 제공하세요.
    """

    # 출력 형식 지침 수정
    output_format_instructions = """

        각 요청 사항에 대한 결과는 다음 형태로 출력하세요:
        ### [항목 제목]

        일 [세부 항목]
        [최소 500자 이상의 일별 분석 내용이 들어갑니다]
        
        \n\n
        
        주 [세부 항목]
        [최소 500자 이상의 주별 분석 내용이 들어갑니다]
        
        \n\n
        
        월 [세부 항목]
        [최소 500자 이상의 월별 분석 내용이 들어갑니다]

        - 다른 형식이나 추가 설명 없이 위 형식을 정확히 따라주세요.
        - :(콜론) 같은 기호를 절대 포함하지 마세요.
        - 각 분석은 충분한 깊이와 통찰력을 제공하도록 작성하세요.
        - 출력 형식 외의 다른 내용을 절대 포함하지 마세요.
        - 분석을 시작하기 전에, 각 섹션에서 최소 500자 이상의 충실한 내용을 작성할 것을 다시 한번 상기하세요.
        """

    human_message += detailed_analysis_instructions
    human_message += output_format_instructions

    # 프롬프트 템플릿 생성
    messages = ChatPromptTemplate.from_messages([
        ("system", system_message),
        ("human", human_message)
    ])

    # 데이터 포맷팅
    formatted_data = format_all_analysis_results(analysis_result)

    # 분석 실행
    print("매출 분석 중...")

    analysis_result_messages = messages.format_messages(
        formatted_data=formatted_data
    )

    response = chat(analysis_result_messages)

    print("매출 분석 완료!")

    return response.content


# 새로운 포맷팅 함수 추가
def format_all_analysis_results(analysis_result):
    """
    일별, 주별, 월별 분석 결과를 모두 포함하여 LLM 프롬프트에 적합한 형태로 변환합니다.
    """
    # 일별 데이터 포맷팅
    daily_sales = analysis_result['sales']['today']
    daily_orders = analysis_result['today_orders']
    daily_top_menus = analysis_result['today_top_menus']
    daily_sales_by_time = analysis_result['today_sales_by_time']
    daily_top_combos = analysis_result['today_top_combos']
    daily_combo_sales = analysis_result['today_combo_sales']
    daily_patterns = analysis_result['today_patterns']

    # 주별 데이터 포맷팅
    weekly_sales = analysis_result['sales']['week']
    weekly_orders = analysis_result['week_orders']
    weekly_top_menus = analysis_result['week_top_menus']
    weekly_sales_by_time = analysis_result['week_sales_by_time']
    weekly_top_combos = analysis_result['week_top_combos']
    weekly_combo_sales = analysis_result['week_combo_sales']
    weekly_patterns = analysis_result['week_patterns']

    # 월별 데이터 포맷팅
    monthly_sales = analysis_result['sales']['month']
    monthly_orders = analysis_result['month_orders']
    monthly_top_menus = analysis_result['month_top_menus']
    monthly_sales_by_time = analysis_result['month_sales_by_time']
    monthly_top_combos = analysis_result['month_top_combos']
    monthly_combo_sales = analysis_result['month_combo_sales']
    monthly_patterns = analysis_result['month_patterns']

    # 통합 포맷팅 텍스트 생성
    formatted_text = f"""
    # 일별 분석 데이터

    ## 기본 매출 정보
    - 일일 총매출: {daily_sales:,}원
    - 거래 건수: {len(daily_orders)}건

    ## 시간대별 매출 분포
    - 오전(8-12시): {sum(daily_sales_by_time[0:4]):,}원 ({sum(daily_sales_by_time[0:4]) / sum(daily_sales_by_time) * 100:.1f}%)
    - 오후(12-17시): {sum(daily_sales_by_time[4:9]):,}원 ({sum(daily_sales_by_time[4:9]) / sum(daily_sales_by_time) * 100:.1f}%)
    - 저녁(17-20시): {sum(daily_sales_by_time[9:]):,}원 ({sum(daily_sales_by_time[9:]) / sum(daily_sales_by_time) * 100:.1f}%)

    ## 인기 메뉴 TOP 5
    {format_top_items(daily_top_menus)}

    ## 인기 메뉴 조합 TOP 5
    {format_top_combos(daily_top_combos) if daily_top_combos else "데이터 없음"}

    ## 메뉴 조합별 매출 TOP 5
    {format_combo_sales(daily_combo_sales) if daily_combo_sales else "데이터 없음"}

    # 주별 분석 데이터

    ## 기본 매출 정보
    - 주간 총매출: {weekly_sales:,}원
    - 주간 거래 건수: {len(weekly_orders)}건

    ## 인기 메뉴 TOP 5
    {format_top_items(weekly_top_menus)}

    ## 인기 메뉴 조합 TOP 5
    {format_top_combos(weekly_top_combos) if weekly_top_combos else "데이터 없음"}

    # 월별 분석 데이터

    ## 기본 매출 정보
    - 월간 총매출: {monthly_sales:,}원
    - 월간 거래 건수: {len(monthly_orders)}건

    ## 인기 메뉴 TOP 5
    {format_top_items(monthly_top_menus)}

    ## 인기 메뉴 조합 TOP 5
    {format_top_combos(monthly_top_combos) if monthly_top_combos else "데이터 없음"}
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


# if __name__ == "__main__":
#     import uvicorn
#
#     uvicorn.run(app, host="0.0.0.0", port=8000)
