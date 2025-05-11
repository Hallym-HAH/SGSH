from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from util.sales_preprocessing import analyze_sales_data

app = FastAPI()

# CORS middleware setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow all origins
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods
    allow_headers=["*"],  # Allow all headers
)


@app.get("/sales_data")
async def get_sales_data(
        sta: str,
        t_od: str,
        w_od: str,
        m_od: str,
        t_sts: str,
        w_sts: str,
        m_sts: str
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
        # Get analysis result
        raw_result = analyze_sales_data(sta, t_od, w_od, m_od, t_sts, w_sts, m_sts)

        # Create a serializable copy of the result
        result = prepare_for_json(raw_result)

        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


def prepare_for_json(data):
    """Prepare data for JSON serialization"""
    if isinstance(data, dict):
        return {k: prepare_for_json(v) for k, v in data.items()}
    elif isinstance(data, list):
        return [prepare_for_json(item) for item in data]
    elif isinstance(data, tuple):
        return list(prepare_for_json(item) for item in data)
    elif isinstance(data, pd.DataFrame):
        records = data.to_dict('records')
        return [prepare_df_record(record) for record in records]
    elif isinstance(data, frozenset):
        return list(data)
    else:
        return data


def prepare_df_record(record):
    """Prepare DataFrame record for JSON serialization"""
    result = {}
    for key, value in record.items():
        if isinstance(value, frozenset):
            result[key] = list(value)
        else:
            result[key] = value
    return result


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8000)
