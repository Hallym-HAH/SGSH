import React, { useState, useEffect } from 'react';
import Chart from 'react-apexcharts';
import { supabaseClient } from "@/lib/supabase";
import { FaWonSign, FaCalendarAlt, FaCalendarCheck, FaChartLine, FaChartPie, FaStar, FaShoppingCart, FaStoreAlt, FaMoneyBillWave, FaChartBar, FaStore } from "react-icons/fa";
import CountUp from "react-countup";

const SalesAnalysis = () => {
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState(0);
    const [startDate, setStartDate] = useState(new Date());
    const [isAnalysisRequested, setIsAnalysisRequested] = useState(false);
    const [salesData, setSalesData] = useState(null);

    const [totalSales, setTotalSales] = useState({
        today: 0,
        week: 0,
        month: 0,
    });

    const [orderData, setOrderData] = useState({
        today: '',
        week: '',
        month: '',
    });

    const [salesTimeData, setSalesTimeData] = useState({
        today: '',
        week: '',
        month: '',
    });

    // 주문 한 건에 대한 매출 계산 함수
    const calculateOrderSales = (priceStr, countStr) => {
        // 입력값이 없으면 0 반환
        if (!priceStr || !countStr) return 0;

        try {
            // 문자열 분리 및 숫자 변환 (parseInt 실패 시 0으로 대체)
            const prices = priceStr.split(',')
                .map(p => {
                    const parsed = parseInt(p.trim());
                    return isNaN(parsed) ? 0 : parsed; // NaN 검사
                });

            const counts = countStr.split(',')
                .map(c => {
                    const parsed = parseInt(c.trim());
                    return isNaN(parsed) ? 0 : parsed; // NaN 검사
                });

            // 배열 길이 확인
            const length = Math.min(prices.length, counts.length);

            // 계산
            let total = 0;
            for (let i = 0; i < length; i++) {
                total += (prices[i] || 0) * (counts[i] || 0);
            }

            return total;
        } catch (err) {
            console.error('매출 계산 중 오류:', err);
            return 0; // 오류 시 0 반환
        }
    };


    useEffect(() => {
        const fetchSales = async () => {
            const { data: { user } } = await supabaseClient.auth.getUser()
            if (user) {
                const now = new Date();

                const { data: u_data } = await supabaseClient.from('profile_data').select(`*`).eq('id', user.id).single();
                var b_id = u_data.b_id;

                // 오늘 날짜 범위 설정
                const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                const nextDayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
                nextDayStart.setDate(nextDayStart.getDate() + 1); // 다음 날 00:00:00

                // 이번 주 날짜 범위 설정 (월요일 시작)
                const weekStart = new Date(todayStart);
                const dayOfWeek = weekStart.getDay();
                const diff = weekStart.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
                weekStart.setDate(diff);

                const weekEnd = new Date(weekStart);
                weekEnd.setDate(weekEnd.getDate() + 6);
                weekEnd.setHours(23, 59, 59, 999);

                // 이번 달 날짜 범위 설정
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                const monthEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);

                // 날짜 포맷 변환 함수
                const formatDateForQuery = (date) => {
                    const pad = (n) => n.toString().padStart(2, '0');
                    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())} ${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
                };
                // 오늘 주문 데이터 조회
                const { data: todayOrders, error: todayError } = await supabaseClient
                    .from('order_data')
                    .select('name, price, count, time')
                    .eq('b_id', b_id)
                    .eq('status', 'check')
                    .gte('time', formatDateForQuery(todayStart))
                    .lt('time', formatDateForQuery(nextDayStart));

                console.log(formatDateForQuery(todayStart));
                console.log(formatDateForQuery(nextDayStart));
                console.log(todayOrders);

                if (todayError) throw new Error('오늘 매출 조회 오류: ' + todayError.message);

                // 이번 주 주문 데이터 조회
                const { data: weekOrders, error: weekError } = await supabaseClient
                    .from('order_data')
                    .select('name, price, count, time')
                    .eq('b_id', b_id)
                    .eq('status', 'check')
                    .gte('time', formatDateForQuery(weekStart))
                    .lte('time', formatDateForQuery(weekEnd));

                if (weekError) throw new Error('이번 주 매출 조회 오류: ' + weekError.message);

                // 이번 달 주문 데이터 조회
                const { data: monthOrders, error: monthError } = await supabaseClient
                    .from('order_data')
                    .select('name, price, count, time')
                    .eq('b_id', b_id)
                    .eq('status', 'check')
                    .gte('time', formatDateForQuery(monthStart))
                    .lte('time', formatDateForQuery(monthEnd));

                if (monthError) throw new Error('이번 달 매출 조회 오류: ' + monthError.message);

                // 각 기간별 매출 계산 (STA)
                const todaySales = todayOrders.reduce((sum, order) =>
                    sum + calculateOrderSales(order.price, order.count), 0);

                const weekSales = weekOrders.reduce((sum, order) =>
                    sum + calculateOrderSales(order.price, order.count), 0);

                const monthSales = monthOrders.reduce((sum, order) =>
                    sum + calculateOrderSales(order.price, order.count), 0);

                // totalSales 상태 업데이트
                setTotalSales({
                    today: todaySales,
                    week: weekSales,
                    month: monthSales
                });

                // OD (t_od, w_od, m_od)
                const formatOrderData = (orders) => {
                    if (!orders || orders.length === 0) return '';

                    const formattedItems = [];

                    orders.forEach((order, index) => {
                        // 주어진 예시 형식에 따라 마지막 쉼표 제거 및 분할
                        const nameList = order.name ? order.name.slice(0, -1).split(',') : [];
                        const priceList = order.price ? order.price.slice(0, -1).split(',') : [];
                        const countList = order.count ? order.count.slice(0, -1).split(',') : [];

                        // 각 메뉴 항목에 대해 지정된 형식으로 문자열 생성
                        for (let i = 0; i < Math.min(priceList.length, countList.length); i++) {
                            // id는 주문 인덱스 + 1로 대체 (실제로는 order.id를 사용해야 함)
                            formattedItems.push(`${index + 1}_${nameList[i]}_${priceList[i]}_${countList[i]}`);
                        }
                    });

                    return formattedItems.join('-');
                };

                // 각 기간별 주문 데이터 형식 변환
                const todayOrderData = formatOrderData(todayOrders).replace(/\s/g, '');
                const weekOrderData = formatOrderData(weekOrders).replace(/\s/g, '');
                const monthOrderData = formatOrderData(monthOrders).replace(/\s/g, '');

                // orderData 상태 업데이트
                setOrderData({
                    today: todayOrderData,
                    week: weekOrderData,
                    month: monthOrderData
                });


                // STS (t_sts, w_sts, m_sts)
                // 시간대별 매출 계산 함수
                const calculateTimeBasedSales = (orders) => {
                    // 8시부터 20시까지의 시간대별 매출 초기화
                    const timeBasedSales = {};
                    for (let hour = 8; hour <= 20; hour++) {
                        timeBasedSales[hour] = 0;
                    }

                    // 각 주문에 대해 시간 추출 및 매출 계산
                    if (orders && orders.length > 0) {
                        orders.forEach(order => {
                            try {
                                // time 필드에서 시간 추출
                                const orderTime = new Date(order.time);
                                const hour = orderTime.getHours();

                                // 8시부터 20시 사이의 주문만 처리
                                if (hour >= 8 && hour <= 20) {
                                    // 주문 매출 계산
                                    const sales = calculateOrderSales(order.price, order.count);

                                    // 해당 시간대의 매출에 추가
                                    timeBasedSales[hour] += sales;
                                }
                            } catch (err) {
                                console.error('시간대별 매출 계산 중 오류:', err);
                            }
                        });
                    }

                    // 8시부터 20시까지의 매출을 배열로 변환하고 언더스코어로 연결
                    const salesArray = [];
                    for (let hour = 8; hour <= 20; hour++) {
                        salesArray.push(timeBasedSales[hour]);
                    }

                    return salesArray.join('_');
                };

                // 오늘, 이번 주, 이번 달의 시간대별 매출 계산
                const todayTimeBasedSales = calculateTimeBasedSales(todayOrders);
                const weekTimeBasedSales = calculateTimeBasedSales(weekOrders);
                const monthTimeBasedSales = calculateTimeBasedSales(monthOrders);

                // salesTimeData 상태 업데이트
                setSalesTimeData({
                    today: todayTimeBasedSales,
                    week: weekTimeBasedSales,
                    month: monthTimeBasedSales
                });
                // // API 호출을 위한 변수 준비
                // var t_sts = `&t_sts=${salesTimeData.today}`;
                // var w_sts = `&w_sts=${salesTimeData.week}`;
                // var m_sts = `&m_sts=${salesTimeData.month}`;
            }
        }

        fetchSales()
    }, []);

    // 매출 데이터 전처리 API 호출 함수
    const fetchSalesData = async () => {
        try {
            setLoading(true);
            setIsAnalysisRequested(true);

            // 환경변수에서 API URL 가져오기
            const apiUrl = process.env.NEXT_PUBLIC_GCP_API_SALES_DATA_URL;

            if (!apiUrl) {
                throw new Error("API URL 환경변수가 설정되지 않았습니다.");
            }

            // 날짜 기반 동적 파라미터 생성
            const formattedDate = formatDateString(startDate);

            var sta = `sta=${totalSales.today}_${totalSales.week}_${totalSales.month}`;
            var t_od = `&t_od=${orderData.today}`;
            var w_od = `&w_od=${orderData.week}`;
            var m_od = `&m_od=${orderData.month}`;
            var t_sts = `&t_sts=${salesTimeData.today}`;
            var w_sts = `&w_sts=${salesTimeData.week}`;
            var m_sts = `&m_sts=${salesTimeData.month}`;

            // Parameters:
            //     sta: "123_456_789" 형태의 문자열 (오늘 매출, 이번 주 매출, 이번 달 매출)
            //     t_od: 오늘 주문 목록 ("id_name_price_count-id_name2_price2_count2" 형태)
            //     w_od: 이번 주 주문 목록
            //     m_od: 이번 달 주문 목록
            //     t_sts: 오늘 시간대별 매출 ("2000_3000_4500_..._9000" 형태)
            //     w_sts: 이번 주 시간대별 매출
            //     m_sts: 이번 달 시간대별 매출
            //     analysis_type: 분석 유형 ('daily', 'weekly', 'monthly' 중 하나, 기본값은 'daily')


            // API URL 구성
            // const fullUrl = `${apiUrl}/sales_data?${sampleDataParams}`;
            const fullUrl = `${apiUrl}/sales_data?${sta + t_od + w_od + m_od + t_sts + w_sts + m_sts}`;

            // API 호출
            const response = await fetch(fullUrl);

            if (!response.ok) {
                throw new Error(`API 응답 오류: ${response.status}`);
            }

            // JSON 응답 데이터 사용
            const data = await response.json();

            // 차트데이터 형식에 맞게 변환
            const processedData = {
                cumulative: {},
                result: {},
                orderByTime: {}
            };

            // 일별/주별/월별 시간대 매출 데이터를 차트데이터 형식으로 변환
            const hours = ['08', '09', '10', '11', '12', '13', '14', '15', '16', '17', '18', '19', '20'];

            // 일별 데이터 처리
            if (data.today_sales_by_time) {
                data.today_sales_by_time.forEach((item, index) => {
                    if (index < hours.length) {
                        processedData.result[`${formattedDate} ${hours[index]}`] = item.sales || 0;
                    }
                });
            }

            // 누적 매출 계산 (일별 데이터 기반)
            let cumulativeSum = 0;
            hours.forEach(hour => {
                const key = `${formattedDate} ${hour}`;
                const value = processedData.result[key] || 0;
                cumulativeSum += value;
                processedData.cumulative[key] = cumulativeSum;
            });

            // 주문 데이터 처리
            if (data.today_orders) {
                // 시간대별 주문 카운트
                const orderCounts = {};
                data.today_orders.forEach(order => {
                    const hour = order.hour || '08'; // 기본값 설정
                    orderCounts[hour] = (orderCounts[hour] || 0) + 1;
                });

                hours.forEach(hour => {
                    processedData.orderByTime[`${formattedDate} ${hour}`] = orderCounts[hour] || 0;
                });
            }

            // 전체 데이터 설정
            const completeData = {
                ...data,
                ...processedData
            };

            setSalesData(completeData);

            // 분석 데이터 가져오기
            await fetchSalesAnalysis();

        } catch (error) {
            console.error("매출 데이터 가져오기 실패:", error);
            setError("매출 데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 매출 데이터 분석 LLM API 호출
    const fetchSalesAnalysis = async () => {
        try {
            setLoading(true);

            // 환경변수에서 API URL 가져오기
            const apiUrl = process.env.NEXT_PUBLIC_GCP_API_ANALYZE_SALES_URL;

            if (!apiUrl) {
                throw new Error("API URL 환경변수가 설정되지 않았습니다.");
            }

            // 날짜 기반 동적 파라미터 생성
            const formattedDate = formatDateString(startDate);

            var sta = `sta=${totalSales.today}_${totalSales.week}_${totalSales.month}`;
            var t_od = `&t_od=${orderData.today}`;
            var w_od = `&w_od=${orderData.week}`;
            var m_od = `&m_od=${orderData.month}`;
            var t_sts = `&t_sts=${salesTimeData.today}`;
            var w_sts = `&w_sts=${salesTimeData.week}`;
            var m_sts = `&m_sts=${salesTimeData.month}`;
            // API URL 구성 - 분석 API 엔드포인트            
            // const fullUrl = `${apiUrl}/analyze_sales?${sampleDataParams}`;
            const fullUrl = `${apiUrl}/analyze_sales?${sta + t_od + w_od + m_od + t_sts + w_sts + m_sts}&analysis_type=daily`;

            // NEXT_PUBLIC_GCP_API_ANALYZE_SALES_URL/docs 참고
            //
            // Parameters:
            //     sta: "123_456_789" 형태의 문자열 (오늘 매출, 이번 주 매출, 이번 달 매출)
            //     t_od: 오늘 주문 목록 ("id_name_price_count-id_name2_price2_count2" 형태)
            //     w_od: 이번 주 주문 목록
            //     m_od: 이번 달 주문 목록
            //     t_sts: 오늘 시간대별 매출 ("2000_3000_4500_..._9000" 형태)
            //     w_sts: 이번 주 시간대별 매출
            //     m_sts: 이번 달 시간대별 매출
            //     analysis_type: 분석 유형 ('daily', 'weekly', 'monthly' 중 하나, 기본값은 'daily')

            // API 호출
            const response = await fetch(fullUrl, {
                // 타임아웃 설정 - LangChain API가 느릴 수 있음
                signal: AbortSignal.timeout(60000) // 160초 타임아웃
            });

            // 텍스트 형식으로 응답 가져오기 (마크다운 형식)
            // const data = await response.text();

            const jsonResponse = await response.json();
            const data = jsonResponse.analysis_content; // content 필드에서 마크다운 텍스트 추출

            if (!response.ok) {
                throw new Error(`API 응답 오류: ${response.status}`);
            }

            // 이스케이프 문자 처리
            const cleanedData = data
                .replace(/\\n/g, '\n') // \n을 실제 줄바꿈으로 변환
                .replace(/\*\*/g, ''); // **를 제거 (볼드체 마크다운)

            // 데이터를 섹션별로 분할 (더 유연한 정규식 사용)
            const sections = cleanedData.split(/(?=### \d+\.)/g).filter(Boolean);

            const processedSections = sections.map(section => {
                // 제목 추출을 위한 더 유연한 정규식
                const titleMatch = section.match(/### \d+\.\s*(.*?)(?:\n|$)/);
                const title = titleMatch ? titleMatch[1].trim() : '제목 없음';

                // 내용 추출
                const content = section.replace(/### \d+\..*?(?:\n|$)/, '').trim();

                return { title, content };
            });

            console.log("분석 데이터 처리 완료:", processedSections);

            // 분석 데이터 설정
            setAnalysisData(processedSections);

            // 분석이 완료되었으므로 로딩 상태 변경
            setLoading(false);

        } catch (error) {
            console.error("매출 분석 데이터 가져오기 실패:", error);
            setError("매출 분석 데이터를 불러오는 중 오류가 발생했습니다.");
            setLoading(false);
        }
    };

    const fetchAllData = async () => {
        try {
            setLoading(true);
            setIsAnalysisRequested(true);

            // 매출 데이터 먼저 로드
            await fetchSalesData();

            // fetchSalesData가 이미 fetchSalesAnalysis를 호출하지 않는 경우에만 필요:
            // await fetchSalesAnalysis();

        } catch (error) {
            console.error("데이터 로딩 실패:", error);
            setError("데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    // 현재 날짜를 YYYY-MM-DD 형식으로 변환
    const formatDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // 마크다운 형식의 콘텐츠를 JSX로 변환
    const renderContent = (content) => {
        const lines = content.split('\n');

        return lines.map((line, index) => {
            // 주 글머리 기호
            if (line.match(/^- /)) {
                return (
                    <li key={index} className="mb-2">
                        {line.substring(2)}
                    </li>
                );
            }
            // 하위 글머리 기호
            else if (line.match(/^\s{2}- /)) {
                return (
                    <li key={index} className="ml-6 mb-1 list-disc">
                        {line.substring(4)}
                    </li>
                );
            }
            // 번호 목록
            else if (line.match(/^\d+\. /)) {
                return (
                    <li key={index} className="mb-2">
                        {line.substring(line.indexOf('.') + 2)}
                    </li>
                );
            }
            // 빈 줄
            else if (line.trim() === '') {
                return <div key={index} className="my-2"></div>;
            }
            // 일반 텍스트
            else {
                return <p key={index} className="mb-2">{line}</p>;
            }
        });
    };

    // 분석 버튼 컴포넌트
    const AnalysisButton = () => (
        <button
            onClick={fetchAllData}
            disabled={loading}
            className="flex items-center justify-center px-6 py-3.5 bg-green-500 text-white font-medium rounded-xl shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-opacity-50 transition-all disabled:bg-gray-400"
        >
            {loading ? (
                <>
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg"
                        fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                            strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    분석 중...
                </>
            ) : (
                <>
                    <FaChartLine className="mr-2" /> 매출 분석하기
                </>
            )}
        </button>
    );
    return (
        <div className="p-6 min-h-screen">
            <div className="max-w-7xl mx-auto">
                <h2 className="text-2xl font-bold mb-6 text-gray-800 flex items-center">
                    <FaChartPie className="mr-2 text-green-500" />
                    매출 분석 대시보드
                </h2>

                {/* 매출 분석 버튼 섹션 */}
                {!isAnalysisRequested && (
                    <div className="flex flex-col items-center justify-center py-12 px-8 bg-white rounded-xl shadow-sm border border-gray-100 mb-8 transition-all hover:shadow-md">
                        <div className="text-center mb-8 max-w-xl">
                            <div className="bg-green-50 w-24 h-24 mx-auto rounded-full flex items-center justify-center mb-6 border-4 border-green-100">
                                <FaChartLine className="h-12 w-12 text-green-500" />
                            </div>
                            <h3 className="text-2xl font-semibold mb-4 text-gray-800">매출 분석을 시작하세요</h3>
                            <p className="text-gray-600 mb-6 text-lg">선택한 기간의 매출 데이터를 분석하여 인사이트를 제공합니다.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl mb-8">
                            <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 flex flex-col items-center">
                                <FaMoneyBillWave className="text-blue-500 text-2xl mb-3" />
                                <h4 className="text-blue-700 font-medium mb-2">매출 추이 분석</h4>
                                <p className="text-gray-600 text-sm text-center">시간대별 매출 패턴을 확인하여 판매 전략을 개선합니다.</p>
                            </div>
                            <div className="bg-green-50 p-5 rounded-xl border border-green-100 flex flex-col items-center">
                                <FaChartBar className="text-green-500 text-2xl mb-3" />
                                <h4 className="text-green-700 font-medium mb-2">인기 메뉴 분석</h4>
                                <p className="text-gray-600 text-sm text-center">가장 많이 팔리는 메뉴와 메뉴 조합을 확인할 수 있습니다.</p>
                            </div>
                            <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 flex flex-col items-center">
                                <FaChartPie className="text-purple-500 text-2xl mb-3" />
                                <h4 className="text-purple-700 font-medium mb-2">매출 통계 요약</h4>
                                <p className="text-gray-600 text-sm text-center">총 매출과 시간대별 피크타임을 시각적으로 확인합니다.</p>
                            </div>
                        </div>

                        <AnalysisButton className="px-8 py-4 text-lg" />

                        <div className="text-center mt-6 text-gray-500 text-sm">
                            <p>데이터 분석에는 약 30초 정도 소요될 수 있습니다.</p>
                        </div>
                    </div>
                )}


                {/* 로딩 표시 */}
                {loading && (
                    <div className="flex flex-col items-center justify-center py-16 px-6 bg-white rounded-xl shadow-sm border border-gray-100 mb-8 transition-all">
                        <div className="bg-green-50 w-24 h-24 rounded-full flex items-center justify-center mb-6 border-4 border-green-100">
                            <svg className="animate-spin h-12 w-12 text-green-500" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">매출 데이터 분석 중</h3>
                        <p className="text-gray-600 mb-6 text-center max-w-md">
                            정확한 분석을 위해 매출 데이터를 처리하고 있습니다.<br />이 작업은 약 30초 정도 소요됩니다.
                        </p>
                        <p className="text-sm text-gray-500 mt-4 flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                            분석이 완료될 때까지 잠시만 기다려주세요
                        </p>
                    </div>
                )}


                {/* 분석 결과 표시 */}
                {!loading && isAnalysisRequested && salesData && (
                    <>
                        {/* KPI 카드 섹션 */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center hover:shadow-md transition-shadow">
                                <div className="rounded-full bg-blue-50 p-4 mr-5">
                                    <FaWonSign className="text-blue-400 text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">오늘 매출</p>
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        <CountUp end={salesData.sales.today} duration={1.5} separator="," />원
                                    </h3>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center hover:shadow-md transition-shadow">
                                <div className="rounded-full bg-green-50 p-4 mr-5">
                                    <FaCalendarAlt className="text-green-400 text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">이번주 매출</p>
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        <CountUp end={salesData.sales.week} duration={1.5} separator="," />원
                                    </h3>
                                </div>
                            </div>
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 flex items-center hover:shadow-md transition-shadow">
                                <div className="rounded-full bg-purple-50 p-4 mr-5">
                                    <FaCalendarCheck className="text-purple-400 text-xl" />
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500 mb-1">이번달 매출</p>
                                    <h3 className="text-2xl font-bold text-gray-800">
                                        <CountUp end={salesData.sales.month} duration={1.5} separator="," />원
                                    </h3>
                                </div>
                            </div>
                        </div>

                        {/* 통합 대시보드 차트 (시간별 매출) */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* 시간대별 매출 추이 */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-semibold mb-5 text-gray-800 pb-2 border-b border-gray-100 flex items-center">
                                    <FaChartLine className="text-green-400 mr-2" />
                                    시간대별 매출 추이
                                </h3>
                                <Chart
                                    options={{
                                        chart: {
                                            type: 'line',
                                            height: 350,
                                            toolbar: {
                                                show: false
                                            },
                                            zoom: { enabled: false },
                                            fontFamily: 'Nanum Gothic, sans-serif',
                                            background: '#fff',
                                        },
                                        stroke: {
                                            curve: 'smooth',
                                            width: 3
                                        },
                                        colors: ['#60A5FA', '#4ADE80', '#C084FC'],
                                        grid: {
                                            borderColor: '#f3f4f6',
                                            row: {
                                                colors: ['#fafafa', 'transparent'],
                                                opacity: 0.5
                                            },
                                        },
                                        xaxis: {
                                            categories: ['8시', '9시', '10시', '11시', '12시', '13시', '14시', '15시', '16시', '17시', '18시', '19시', '20시'],
                                            labels: {
                                                style: {
                                                    colors: '#64748b',
                                                    fontSize: '11px'
                                                }
                                            }
                                        },
                                        yaxis: {
                                            labels: {
                                                formatter: function (val) {
                                                    return val.toLocaleString() + '원';
                                                },
                                                style: {
                                                    colors: '#64748b',
                                                    fontSize: '11px'
                                                }
                                            }
                                        },
                                        tooltip: {
                                            theme: 'light',
                                            y: {
                                                formatter: function (val) {
                                                    return val.toLocaleString() + '원';
                                                }
                                            }
                                        },
                                        legend: {
                                            position: 'top',
                                            horizontalAlign: 'right',
                                            fontSize: '12px'
                                        },
                                        markers: {
                                            size: 4,
                                            hover: {
                                                size: 6
                                            }
                                        }
                                    }}
                                    series={[
                                        {
                                            name: '오늘',
                                            data: salesData.today_sales_by_time
                                        },
                                        {
                                            name: '이번주',
                                            data: salesData.week_sales_by_time
                                        },
                                        {
                                            name: '이번달',
                                            data: salesData.month_sales_by_time
                                        }
                                    ]}
                                    type="line"
                                    height={350}
                                />
                            </div>

                            {/* 누적 매출 현황 */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-semibold mb-5 text-gray-800 pb-2 border-b border-gray-100 flex items-center">
                                    <FaChartPie className="text-green-400 mr-2" />
                                    누적 매출 현황
                                </h3>
                                <Chart
                                    options={{
                                        chart: {
                                            type: 'bar',
                                            height: 350,
                                            stacked: true,
                                            toolbar: {
                                                show: false
                                            },
                                            zoom: { enabled: false },
                                            fontFamily: 'Nanum Gothic, sans-serif',
                                            background: '#fff',
                                        },
                                        colors: ['#60A5FA', '#4ADE80', '#C084FC'],
                                        plotOptions: {
                                            bar: {
                                                horizontal: false,
                                                columnWidth: '65%',
                                                borderRadius: 6,
                                            },
                                        },
                                        grid: {
                                            borderColor: '#f3f4f6',
                                            row: {
                                                colors: ['#fafafa', 'transparent'],
                                                opacity: 0.5
                                            },
                                        },
                                        xaxis: {
                                            categories: ['총 매출'],
                                            labels: {
                                                style: {
                                                    colors: '#64748b',
                                                    fontSize: '12px'
                                                }
                                            }
                                        },
                                        yaxis: {
                                            labels: {
                                                formatter: function (val) {
                                                    return val.toLocaleString() + '원';
                                                },
                                                style: {
                                                    colors: '#64748b',
                                                    fontSize: '11px'
                                                }
                                            }
                                        },
                                        tooltip: {
                                            theme: 'light',
                                            y: {
                                                formatter: function (val) {
                                                    return val.toLocaleString() + '원';
                                                }
                                            }
                                        },
                                        fill: {
                                            opacity: 1
                                        },
                                        legend: {
                                            position: 'top',
                                            horizontalAlign: 'right',
                                            fontSize: '12px'
                                        },
                                        dataLabels: {
                                            enabled: true,
                                            formatter: function (val) {
                                                return val.toLocaleString() + '원';
                                            },
                                            style: {
                                                fontSize: '11px',
                                                colors: ['#fff']
                                            },
                                            dropShadow: {
                                                enabled: false
                                            }
                                        }
                                    }}
                                    series={[
                                        {
                                            name: '오늘',
                                            data: [salesData.sales.today]
                                        },
                                        {
                                            name: '이번주',
                                            data: [salesData.sales.week]
                                        },
                                        {
                                            name: '이번달',
                                            data: [salesData.sales.month]
                                        }
                                    ]}
                                    type="bar"
                                    height={350}
                                />
                            </div>
                        </div>

                        {/* 매출 비율 & 주문 분석 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* 매출 비율 차트 */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-semibold mb-5 text-gray-800 pb-2 border-b border-gray-100 flex items-center">
                                    <FaShoppingCart className="text-green-400 mr-2" />
                                    매출 비율 분석
                                </h3>
                                <Chart
                                    options={{
                                        chart: {
                                            type: 'donut',
                                            fontFamily: 'Nanum Gothic, sans-serif',
                                            background: '#fff',
                                        },
                                        colors: ['#60A5FA', '#4ADE80', '#C084FC'],
                                        labels: ['오늘', '이번주', '이번달'],
                                        plotOptions: {
                                            pie: {
                                                donut: {
                                                    size: '55%',
                                                    labels: {
                                                        show: true,
                                                        total: {
                                                            show: true,
                                                            label: '총 매출',
                                                            fontSize: '16px',
                                                            fontWeight: 600,
                                                            color: '#334155',
                                                            formatter: function (w) {
                                                                return salesData.sales.month.toLocaleString() + '원';
                                                            }
                                                        },
                                                        value: {
                                                            show: true,
                                                            fontSize: '22px',
                                                            fontWeight: 600,
                                                            color: '#334155',
                                                            formatter: function (val) {
                                                                return val.toLocaleString() + '원';
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        },
                                        dataLabels: {
                                            enabled: true,
                                            formatter: function (val, opt) {
                                                return Math.round(val) + '%';
                                            },
                                            style: {
                                                fontSize: '12px',
                                                colors: ['#fff'],
                                                fontWeight: 400
                                            },
                                            dropShadow: {
                                                enabled: false
                                            }
                                        },
                                        legend: {
                                            position: 'bottom',
                                            fontSize: '12px',
                                            markers: {
                                                width: 10,
                                                height: 10,
                                                radius: 6,
                                            }
                                        },
                                        tooltip: {
                                            theme: 'light',
                                            y: {
                                                formatter: function (val, { series, seriesIndex, dataPointIndex, w }) {
                                                    const values = [salesData.sales.today, salesData.sales.week, salesData.sales.month];
                                                    return values[seriesIndex].toLocaleString() + '원';
                                                }
                                            }
                                        }
                                    }}
                                    series={[
                                        salesData.sales.today,
                                        salesData.sales.week,
                                        salesData.sales.month
                                    ]}
                                    type="donut"
                                    height={350}
                                />
                            </div>

                            {/* 주문 시간대 분석 */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-semibold mb-5 text-gray-800 pb-2 border-b border-gray-100 flex items-center">
                                    <FaStoreAlt className="text-green-400 mr-2" />
                                    주문 시간대 분석
                                </h3>
                                <Chart
                                    options={{
                                        chart: {
                                            type: 'heatmap',
                                            toolbar: {
                                                show: false
                                            },
                                            fontFamily: 'Nanum Gothic, sans-serif',
                                            background: '#fff',
                                        },
                                        dataLabels: {
                                            enabled: false
                                        },
                                        xaxis: {
                                            categories: ['8시', '9시', '10시', '11시', '12시', '13시', '14시', '15시', '16시', '17시', '18시', '19시', '20시'],
                                            labels: {
                                                style: {
                                                    colors: '#64748b',
                                                    fontSize: '11px'
                                                }
                                            }
                                        },
                                        plotOptions: {
                                            heatmap: {
                                                radius: 3,
                                                enableShades: true,
                                                colorScale: {
                                                    ranges: [
                                                        {
                                                            from: 0,
                                                            to: 0,
                                                            color: '#F8FAFC',
                                                            name: '없음',
                                                        },
                                                        {
                                                            from: 1,
                                                            to: 10000,
                                                            color: '#BAE6FD',
                                                            name: '낮음',
                                                        },
                                                        {
                                                            from: 10001,
                                                            to: 50000,
                                                            color: '#38BDF8',
                                                            name: '중간',
                                                        },
                                                        {
                                                            from: 50001,
                                                            to: 500000,
                                                            color: '#0284C7',
                                                            name: '높음',
                                                        }
                                                    ]
                                                }
                                            }
                                        },
                                        tooltip: {
                                            theme: 'light',
                                            y: {
                                                formatter: function (val) {
                                                    return val.toLocaleString() + '원';
                                                }
                                            }
                                        }
                                    }}
                                    series={[
                                        {
                                            name: '오늘',
                                            data: salesData.today_sales_by_time.map(value => value)
                                        },
                                        {
                                            name: '이번주',
                                            data: salesData.week_sales_by_time.map(value => value)
                                        },
                                        {
                                            name: '이번달',
                                            data: salesData.month_sales_by_time.map(value => value)
                                        }
                                    ]}
                                    type="heatmap"
                                    height={350}
                                />
                            </div>
                        </div>

                        {/* 인기 메뉴 & 인기 조합 분석 */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            {/* 인기 메뉴 차트 */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-semibold mb-5 text-gray-800 pb-2 border-b border-gray-100 flex items-center">
                                    <FaStar className="text-green-400 mr-2" />
                                    인기 메뉴 TOP 5
                                </h3>
                                <Chart
                                    options={{
                                        chart: {
                                            type: 'bar',
                                            toolbar: {
                                                show: false
                                            },
                                            fontFamily: 'Nanum Gothic, sans-serif',
                                            background: '#fff',
                                        },
                                        plotOptions: {
                                            bar: {
                                                horizontal: true,
                                                barHeight: '60%',
                                                borderRadius: 6,
                                                distributed: true
                                            },
                                        },
                                        grid: {
                                            borderColor: '#f3f4f6',
                                            xaxis: {
                                                lines: {
                                                    show: false
                                                }
                                            },
                                            yaxis: {
                                                lines: {
                                                    show: false
                                                }
                                            }
                                        },
                                        dataLabels: {
                                            enabled: true,
                                            formatter: function (val) {
                                                return val + '개';
                                            },
                                            style: {
                                                fontSize: '12px',
                                                colors: ['#fff'],
                                                fontWeight: 500
                                            },
                                            dropShadow: {
                                                enabled: false
                                            }
                                        },
                                        xaxis: {
                                            categories: salesData.month_top_menus.map(item => item[0]),
                                            labels: {
                                                style: {
                                                    colors: '#64748b',
                                                    fontSize: '11px'
                                                }
                                            }
                                        },
                                        yaxis: {
                                            labels: {
                                                style: {
                                                    colors: '#334155',
                                                    fontSize: '12px'
                                                }
                                            }
                                        },
                                        tooltip: {
                                            theme: 'light',
                                            y: {
                                                formatter: function (val) {
                                                    return val + '개';
                                                }
                                            }
                                        },
                                        fill: {
                                            colors: ['#60A5FA', '#4ADE80', '#C084FC', '#F472B6', '#FBBF24'].slice(0, salesData.month_top_menus.length)
                                        }
                                    }}
                                    series={[
                                        {
                                            name: '판매량',
                                            data: salesData.month_top_menus.map(item => item[1])
                                        }
                                    ]}
                                    type="bar"
                                    height={350}
                                />
                            </div>

                            {/* 인기 조합 차트 */}
                            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                                <h3 className="text-lg font-semibold mb-5 text-gray-800 pb-2 border-b border-gray-100 flex items-center">
                                    <FaStoreAlt className="text-green-400 mr-2" />
                                    인기 메뉴 조합 TOP 5
                                </h3>
                                <div className="overflow-hidden mt-1">
                                    <table className="min-w-full border-separate border-spacing-0">
                                        <thead>
                                            <tr>
                                                <th className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50 py-3.5 px-4 text-left text-sm font-semibold text-gray-600 rounded-tl-lg">순위</th>
                                                <th className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50 py-3.5 px-4 text-left text-sm font-semibold text-gray-600">메뉴 조합</th>
                                                <th className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50 py-3.5 px-4 text-right text-sm font-semibold text-gray-600">판매 횟수</th>
                                                <th className="sticky top-0 z-10 border-b border-gray-200 bg-gray-50 py-3.5 px-4 text-right text-sm font-semibold text-gray-600 rounded-tr-lg">매출 금액</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-gray-200 bg-white">
                                            {salesData.month_top_combos.slice(0, 5).map((combo, index) => {
                                                const comboSales = salesData.month_combo_sales.find(
                                                    item => JSON.stringify(item[0]) === JSON.stringify(combo[0])
                                                );
                                                const salesAmount = comboSales ? comboSales[1] : 0;

                                                return (
                                                    <tr key={index} className={index % 2 === 0 ? 'bg-white hover:bg-gray-50' : 'bg-gray-50 hover:bg-gray-100'}>
                                                        <td className="py-4 px-4 text-sm font-medium text-green-500 whitespace-nowrap">{index + 1}</td>
                                                        <td className="py-4 px-4 text-sm text-gray-700 whitespace-nowrap">
                                                            {combo[0].join(' + ')}
                                                        </td>
                                                        <td className="py-4 px-4 text-sm text-gray-700 text-right whitespace-nowrap">
                                                            {combo[1]}회
                                                        </td>
                                                        <td className="py-4 px-4 text-sm font-medium text-green-500 text-right whitespace-nowrap">
                                                            {salesAmount.toLocaleString()}원
                                                        </td>
                                                    </tr>
                                                );
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        {/* 매출 통계 요약 */}
                        <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-8 hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-semibold mb-5 text-gray-800 pb-2 border-b border-gray-100 flex items-center">
                                <FaWonSign className="text-green-400 mr-2" />
                                매출 통계 요약
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="bg-blue-50 p-5 rounded-xl border border-blue-100 hover:bg-blue-100 transition-colors">
                                    <div className="flex items-center mb-3">
                                        <FaChartLine className="text-blue-400 text-lg mr-2" />
                                        <h4 className="text-blue-600 font-medium">피크 타임 분석</h4>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {(() => {
                                            const highestHour = salesData.month_sales_by_time.indexOf(
                                                Math.max(...salesData.month_sales_by_time)
                                            );
                                            return `이번달 가장 매출이 높은 시간대는 ${highestHour + 8}시로 ${Math.max(...salesData.month_sales_by_time).toLocaleString()}원의 매출을 기록했습니다.`;
                                        })()}
                                    </p>
                                </div>
                                <div className="bg-green-50 p-5 rounded-xl border border-green-100 hover:bg-green-100 transition-colors">
                                    <div className="flex items-center mb-3">
                                        <FaStar className="text-green-400 text-lg mr-2" />
                                        <h4 className="text-green-600 font-medium">베스트 셀러</h4>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {salesData.month_top_menus.length > 0
                                            ? `이번달 가장 인기있는 메뉴는 "${salesData.month_top_menus[0][0]}"으로 총 ${salesData.month_top_menus[0][1]}회 판매되었습니다.`
                                            : "이번달 메뉴 판매 데이터가 없습니다."
                                        }
                                    </p>
                                </div>
                                <div className="bg-purple-50 p-5 rounded-xl border border-purple-100 hover:bg-purple-100 transition-colors">
                                    <div className="flex items-center mb-3">
                                        <FaShoppingCart className="text-purple-400 text-lg mr-2" />
                                        <h4 className="text-purple-600 font-medium">인기 조합</h4>
                                    </div>
                                    <p className="text-gray-700 text-sm leading-relaxed">
                                        {salesData.month_top_combos.length > 0
                                            ? `가장 많이 함께 주문된 조합은 "${salesData.month_top_combos[0][0].join(' + ')}"으로 ${salesData.month_top_combos[0][1]}회 주문되었습니다.`
                                            : "이번달 조합 판매 데이터가 없습니다."
                                        }
                                    </p>
                                </div>
                            </div>
                        </div>
                    </>
                )}


                {/* 섹션 탭 네비게이션 */}
                {analysisData && (
                    <div className="mb-8">
                        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-2 overflow-hidden">
                            <ul className="flex flex-wrap gap-2 text-sm font-medium"
                                role="tablist">
                                {analysisData.map((section, idx) => {
                                    // 각 섹션에 맞는 아이콘 설정
                                    const getIcon = (title) => {
                                        if (title.includes('매출')) return <FaChartLine className="mr-2" />;
                                        if (title.includes('주문')) return <FaShoppingCart className="mr-2" />;
                                        if (title.includes('메뉴')) return <FaStore className="mr-2" />;
                                        return <FaChartPie className="mr-2" />;
                                    };

                                    return (
                                        <li key={idx} className="flex-1" role="presentation">
                                            <button
                                                className={`w-full py-3 px-4 rounded-lg flex items-center justify-center gap-1 font-medium transition-all 
                                    ${activeSection === idx
                                                        ? "bg-green-500 text-white shadow-sm"
                                                        : "text-gray-600 hover:bg-gray-50"
                                                    }`}
                                                onClick={() => setActiveSection(idx)}
                                                aria-selected={activeSection === idx}
                                                role="tab"
                                                aria-controls={`section-${idx}`}
                                                id={`tab-${idx}`}
                                            >
                                                {getIcon(section.title)}
                                                {section.title}
                                            </button>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    </div>
                )}

                {/* 섹션 내용 */}
                {analysisData && (
                    <div className="tab-content">
                        {analysisData.map((section, idx) => (
                            <div
                                key={idx}
                                className={`tab-pane transition-opacity duration-300 ${activeSection === idx ? 'opacity-100' : 'opacity-0 hidden'}`}
                                id={`section-${idx}`}
                                role="tabpanel"
                                aria-labelledby={`tab-${idx}`}
                                tabIndex={0}
                            >
                                <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow">
                                    <h3 className="text-lg font-semibold mb-5 text-gray-800 pb-2 border-b border-gray-100 flex items-center">
                                        {section.title}
                                    </h3>
                                    <div className="prose max-w-none mx-4">
                                        {renderContent(section.content)}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}


                {/* 오류 표시 */}
                {error && (
                    <div className="p-6 text-center text-red-500 bg-white rounded-lg shadow">
                        <h3 className="text-lg font-medium">{error}</h3>
                        <button
                            onClick={() => {
                                setError(null);
                                setIsAnalysisRequested(false);
                            }}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                        >
                            재시도
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SalesAnalysis;
