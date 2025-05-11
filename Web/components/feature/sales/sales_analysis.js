import React, {useState, useEffect} from 'react';
import Chart from 'react-apexcharts';
import {chartData, chartData2, chartData3, dashboardChartData} from './chartData';

const SalesAnalysis = () => {
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState(0);
    const [dateView, setDateView] = useState('daily');
    const [startDate, setStartDate] = useState(new Date());
    const [isAnalysisRequested, setIsAnalysisRequested] = useState(false);
    const [salesData, setSalesData] = useState(null);

    // API 호출 함수
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

            // URL 파라미터 구성 (일단 샘플 데이터)
            const sampleDataParams = "sta=777_7777_77777&t_od=1_커피_4000_2-1_케이크_6000_1-2_샌드위치_7000_1-2_주스_5000_1-3_커피_4000_1-3_도넛_3000_2-4_커피_4000_2-4_케이크_6000_1-5_커피_4000_2-5_케이크_6000_1-6_샌드위치_7000_1-6_주스_5000_1-7_커피_4000_1-7_도넛_3000_2-8_커피_4000_2-8_케이크_6000_1-9_커피_4000_2-9_크로플_4500_1-9_마카롱_2000_2-10_커피_4000_2-10_케이크_6000_1-11_케이크_6000_1-11_주스_5000_1-11_샌드위치_7000_1-12_커피_4000_1-12_도넛_3000_3-13_커피_4000_2-13_케이크_6000_1-14_커피_4000_2-14_케이크_6000_1-15_샌드위치_7000_1-15_주스_5000_2-16_커피_4000_1-16_도넛_3000_2-17_커피_4000_2-17_케이크_6000_1-18_커피_4000_2-18_도넛_3000_2-19_샌드위치_7000_1-19_주스_5000_1-20_커피_4000_2-20_크로플_4500_1-20_마카롱_2000_2&w_od=21_커피_4000_2-21_케이크_6000_1-22_샌드위치_7000_1-22_주스_5000_1-23_커피_4000_1-23_도넛_3000_2-24_커피_4000_2-24_케이크_6000_1-25_커피_4000_3-25_케이크_6000_1-26_샌드위치_7000_1-26_주스_5000_1-27_커피_4000_1-27_도넛_3000_3-28_커피_4000_2-28_케이크_6000_1-29_커피_4000_2-29_크로플_4500_1-29_마카롱_2000_3-30_커피_4000_2-30_케이크_6000_1-31_케이크_6000_1-31_주스_5000_1-31_샌드위치_7000_2-32_커피_4000_1-32_도넛_3000_3-33_커피_4000_2-33_케이크_6000_1-34_커피_4000_2-34_케이크_6000_1-35_샌드위치_7000_1-35_주스_5000_2-36_커피_4000_1-36_도넛_3000_1-37_커피_4000_2-37_케이크_6000_2-38_커피_4000_2-38_도넛_3000_2-39_샌드위치_7000_1-39_주스_5000_1-40_커피_4000_2-40_크로플_4500_1-40_마카롱_2000_2-41_커피_4000_2-41_케이크_6000_1-42_샌드위치_7000_1-42_주스_5000_2-43_커피_4000_1-43_도넛_3000_2-44_커피_4000_2-44_케이크_6000_1-45_쿠키_2500_2-45_티라미수_6500_1-46_샌드위치_7000_1-46_주스_5000_1-47_커피_4000_1-47_도넛_3000_2-48_커피_4000_2-48_케이크_6000_1-49_커피_4000_2-49_크로플_4500_1-49_마카롱_2000_2-50_커피_4000_2-50_케이크_6000_1-51_케이크_6000_1-51_주스_5000_1-51_샌드위치_7000_1-52_커피_4000_1-52_도넛_3000_2-53_커피_4000_2-53_케이크_6000_1-54_커피_4000_2-54_케이크_6000_1-55_샌드위치_7000_1-55_주스_5000_1-56_커피_4000_1-56_도넛_3000_2-57_커피_4000_2-57_케이크_6000_1-58_스무디_5500_3-58_쿠키_2500_2-59_샌드위치_7000_1-59_주스_5000_1-60_커피_4000_2-60_크로플_4500_1-60_마카롱_2000_2&m_od=61_커피_4000_2-61_케이크_6000_1-62_샌드위치_7000_1-62_주스_5000_1-63_커피_4000_1-63_도넛_3000_2-64_커피_4000_2-64_케이크_6000_1-65_커피_4000_2-65_케이크_6000_1-66_샌드위치_7000_1-66_주스_5000_1-67_커피_4000_1-67_도넛_3000_2-68_커피_4000_2-68_케이크_6000_1-69_커피_4000_2-69_크로플_4500_1-69_마카롱_2000_2-70_커피_4000_2-70_케이크_6000_1-71_케이크_6000_1-71_주스_5000_1-71_샌드위치_7000_1-72_커피_4000_1-72_도넛_3000_2-73_커피_4000_2-73_케이크_6000_1-74_커피_4000_2-74_케이크_6000_1-75_샌드위치_7000_1-75_주스_5000_1-76_커피_4000_1-76_도넛_3000_2-77_커피_4000_2-77_케이크_6000_1-78_커피_4000_2-78_도넛_3000_2-79_샌드위치_7000_1-79_주스_5000_1-80_커피_4000_2-80_크로플_4500_1-80_마카롱_2000_2-81_커피_4000_2-81_케이크_6000_2-82_샌드위치_7000_1-82_주스_5000_1-83_커피_4000_1-83_도넛_3000_2-84_커피_4000_2-84_케이크_6000_1-85_커피_4000_2-85_케이크_6000_1-86_샌드위치_7000_1-86_주스_5000_1-87_커피_4000_1-87_도넛_3000_2-88_커피_4000_2-88_케이크_6000_1-89_커피_4000_2-89_크로플_4500_1-89_마카롱_2000_2-90_커피_4000_2-90_케이크_6000_1-91_케이크_6000_1-91_주스_5000_1-91_샌드위치_7000_1-92_커피_4000_1-92_도넛_3000_2-93_커피_4000_2-93_케이크_6000_1-94_커피_4000_2-94_케이크_6000_1-95_샌드위치_7000_1-95_주스_5000_1-96_커피_4000_1-96_도넛_3000_2-97_커피_4000_2-97_케이크_6000_1-98_커피_4000_2-98_도넛_3000_3-99_샌드위치_7000_1-99_주스_5000_1-100_커피_4000_3-100_크로플_4500_1-100_마카롱_2000_2-101_커피_4000_2-101_케이크_6000_1-102_샌드위치_7000_1-102_주스_5000_1-103_커피_4000_1-103_도넛_3000_2-104_커피_4000_2-104_케이크_6000_1-105_커피_4000_1-105_케이크_6000_1-106_샌드위치_7000_1-106_주스_5000_1-107_커피_4000_1-107_도넛_3000_2-108_커피_4000_2-108_케이크_6000_2-109_커피_4000_2-109_크로플_4500_1-109_마카롱_2000_3-110_커피_4000_2-110_케이크_6000_1-111_케이크_6000_1-111_주스_5000_1-111_샌드위치_7000_1-112_커피_4000_1-112_도넛_3000_2-113_커피_4000_2-113_케이크_6000_1-114_커피_4000_2-114_케이크_6000_1-115_샌드위치_7000_1-115_주스_5000_1-116_커피_4000_1-116_도넛_3000_3-117_커피_4000_2-117_케이크_6000_1-118_커피_4000_3-118_도넛_3000_2-119_샌드위치_7000_1-119_주스_5000_1-120_커피_4000_2-120_크로플_4500_1-120_마카롱_2000_2&t_sts=7562_8943_9124_8765_7689_6234_5873_6798_7234_7865_8123_7654_6532&w_sts=56987_61324_67845_78965_89753_93421_87654_76543_65432_71234_68754_59876_47865&m_sts=453678_478965_512345_567894_598765_624356_687543_765432_832156_854321_798765_732145_654321"

            // API URL 구성
            const fullUrl = `${apiUrl}/sales_data?${sampleDataParams}`;

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

    // 현재 선택된 기간 기준으로 데이터 접근하기
    const getCurrentData = () => {
        if (!salesData) return null;

        switch (dateView) {
            case 'daily':
                return {
                    sales: salesData.sales.today,
                    orders: salesData.today_orders,
                    salesByTime: salesData.today_sales_by_time,
                    topMenus: salesData.today_top_menus,
                    topCombos: salesData.today_top_combos
                };
            case 'weekly':
                return {
                    sales: salesData.sales.week,
                    orders: salesData.week_orders,
                    salesByTime: salesData.week_sales_by_time,
                    topMenus: salesData.week_top_menus,
                    topCombos: salesData.week_top_combos
                };
            case 'monthly':
                return {
                    sales: salesData.sales.month,
                    orders: salesData.month_orders,
                    salesByTime: salesData.month_sales_by_time,
                    topMenus: salesData.month_top_menus,
                    topCombos: salesData.month_top_combos
                };
            default:
                return null;
        }
    };

    // 현재 날짜를 YYYY-MM-DD 형식으로 변환
    const formatDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    };

    // 누적 매출 차트
    const renderCumulativeChart = () => {
        if (!salesData) return null;

        const formattedDate = formatDateString(startDate);
        const chartConfig = chartData(formattedDate, salesData);

        return (
            <div className="p-4 bg-white rounded-lg shadow h-80">
                <h3 className="text-lg font-bold mb-3">{chartConfig.title}</h3>
                <Chart
                    options={chartConfig.options}
                    series={chartConfig.series}
                    type="line"
                    height="90%"
                    width="100%"
                />
            </div>
        );
    };

    // 시간대별 매출 차트
    const renderTimeChart = () => {
        if (!salesData) return null;

        const formattedDate = formatDateString(startDate);
        const chartConfig = chartData2(formattedDate, salesData);

        return (
            <div className="p-4 bg-white rounded-lg shadow h-80">
                <h3 className="text-lg font-bold mb-3">{chartConfig.title}</h3>
                <Chart
                    options={chartConfig.options}
                    series={chartConfig.series}
                    type="line"
                    height="90%"
                    width="100%"
                />
            </div>
        );
    };

    // 주문 건수 차트
    const renderOrdersChart = () => {
        if (!salesData) return null;

        const formattedDate = formatDateString(startDate);
        const chartConfig = chartData3(formattedDate, salesData);

        return (
            <div className="p-4 bg-white rounded-lg shadow h-80">
                <h3 className="text-lg font-bold mb-3">{chartConfig.title}</h3>
                <Chart
                    options={chartConfig.options}
                    series={chartConfig.series}
                    type="line"
                    height="90%"
                    width="100%"
                />
            </div>
        );
    };

    // 대시보드 통합 차트
    const renderDashboardChart = () => {
        if (!salesData) return null;

        const formattedDate = formatDateString(startDate);
        const chartConfig = dashboardChartData(formattedDate, salesData);

        return (
            <div className="p-4 bg-white rounded-lg shadow h-96 col-span-2">
                <h3 className="text-lg font-bold mb-3">매출 대시보드</h3>
                <Chart
                    options={chartConfig.options}
                    series={chartConfig.series}
                    type="line"
                    height="90%"
                    width="100%"
                />
            </div>
        );
    };

    // 인기 메뉴 차트
    const renderPopularMenuChart = () => {
        const currentData = getCurrentData();
        if (!currentData || !currentData.topMenus || currentData.topMenus.length === 0) return null;

        const series = [{
            name: '판매 수량',
            data: currentData.topMenus.map(item => item[1])
        }];

        const options = {
            chart: {
                type: 'bar',
                toolbar: {show: false}
            },
            // title: {
            //     text: '인기 메뉴 TOP 5',
            //     align: 'center'
            // },
            plotOptions: {
                bar: {
                    columnWidth: '55%',
                    distributed: true
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val + "개";
                }
            },
            colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            xaxis: {
                categories: currentData.topMenus.map(item => item[0])
            },
            legend: {show: false}
        };

        return (
            <div className="p-4 bg-white rounded-lg shadow h-80">
                <h3 className="text-lg font-bold mb-3">인기 메뉴</h3>
                <Chart
                    options={options}
                    series={series}
                    type="bar"
                    height="90%"
                    width="100%"
                />
            </div>
        );
    };

    // 시간대별 매출 비율 차트 (도넛 차트)
    const renderSalesRatioChart = () => {
        const currentData = getCurrentData();

        // 데이터 유효성 검사
        const hasValidData = currentData &&
            currentData.salesByTime &&
            currentData.salesByTime.length > 0 &&
            currentData.salesByTime.some(item => item.sales > 0);

        if (!hasValidData) {
            // 데이터가 없을 때 표시할 내용
            return (
                <div className="p-4 bg-white rounded-lg shadow h-80 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-bold mb-3">시간대별 매출 비율</h3>
                    <div className="relative w-40 h-40">
                        {/* 회색 도넛 모양 placeholder */}
                        <div className="absolute inset-0 rounded-full border-8 border-gray-200 opacity-50"></div>
                        <div className="absolute inset-4 rounded-full bg-white"></div>
                        {/* 노 데이터 아이콘 */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                    </div>
                    <p className="text-gray-500 mt-4 text-center">데이터가 없습니다</p>
                    <p className="text-sm text-gray-400 mt-1 text-center">시간대별 판매가 발생하면 여기에 표시됩니다</p>

                    {/* 선택적: 사용자 액션을 추가할 수 있습니다 */}
                    <button
                        onClick={fetchSalesData}
                        className="mt-4 px-3 py-1 bg-blue-100 text-blue-600 rounded-md text-sm hover:bg-blue-200 transition-colors"
                    >
                        데이터 새로고침
                    </button>
                </div>
            );
        }

        // 오전/오후/저녁 시간대별 매출 계산
        const morningTotal = currentData.salesByTime
            .filter(item => item.hour >= 8 && item.hour < 12)
            .reduce((sum, item) => sum + (item.sales || 0), 0);

        const afternoonTotal = currentData.salesByTime
            .filter(item => item.hour >= 12 && item.hour < 17)
            .reduce((sum, item) => sum + (item.sales || 0), 0);

        const eveningTotal = currentData.salesByTime
            .filter(item => item.hour >= 17 && item.hour <= 20)
            .reduce((sum, item) => sum + (item.sales || 0), 0);

        const total = morningTotal + afternoonTotal + eveningTotal;

        // 백분율 계산
        const morning = total > 0 ? parseFloat((morningTotal / total * 100).toFixed(1)) : 0;
        const afternoon = total > 0 ? parseFloat((afternoonTotal / total * 100).toFixed(1)) : 0;
        const evening = total > 0 ? parseFloat((eveningTotal / total * 100).toFixed(1)) : 0;

        const series = [morning, afternoon, evening];

        const options = {
            chart: {
                type: 'donut'
            },
            labels: ['오전', '오후', '저녁'],
            colors: ['#FF9F43', '#4BC0C0', '#9966FF'],
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%'
                    }
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val.toFixed(1) + '%';
                }
            },
            legend: {
                position: 'bottom'
            },
            tooltip: {
                y: {
                    formatter: function (value) {
                        return value.toFixed(1) + '%';
                    }
                }
            },
            responsive: [{
                breakpoint: 480,
                options: {
                    chart: {
                        width: 200
                    },
                    legend: {
                        position: 'bottom'
                    }
                }
            }]
        };

        return (
            <div className="p-4 bg-white rounded-lg shadow h-80">
                <h3 className="text-lg font-bold mb-3">시간대별 매출 비율</h3>
                <Chart
                    options={options}
                    series={series}
                    type="donut"
                    height="90%"
                    width="100%"
                />
            </div>
        );
    };

    // 인기 메뉴 조합 차트
    const renderComboChart = () => {
        const currentData = getCurrentData();
        if (!currentData || !currentData.topCombos || currentData.topCombos.length === 0) {
            // 데이터가 없을 때 표시할 내용
            return (
                <div className="p-4 bg-white rounded-lg shadow h-80 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-bold mb-3">인기 메뉴 조합</h3>
                    <div className="relative w-40 h-40">
                        <div className="absolute inset-0 rounded-full border-8 border-gray-200 opacity-50"></div>
                        <div className="absolute inset-4 rounded-full bg-white"></div>
                        <div className="absolute inset-0 flex items-center justify-center">
                            <svg className="w-10 h-10 text-gray-400" fill="none" stroke="currentColor"
                                 viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                            </svg>
                        </div>
                    </div>
                    <p className="text-gray-500 mt-4 text-center">데이터가 없습니다</p>
                    <p className="text-sm text-gray-400 mt-1 text-center">메뉴 조합 판매가 발생하면 여기에 표시됩니다</p>
                </div>
            );
        }

        // 차트 데이터 형식 변환
        const labels = currentData.topCombos.map(combo => `${combo[0][0]} + ${combo[0][1]}`);
        const data = currentData.topCombos.map(combo => combo[1]);

        // 가로 막대 차트 설정
        const series = [{
            name: '판매 수량',
            data: data
        }];

        const options = {
            chart: {
                type: 'bar',
                toolbar: {show: false}
            },
            // title: {
            //     text: '인기 메뉴 조합 TOP 5',
            //     align: 'center'
            // },
            plotOptions: {
                bar: {
                    horizontal: true,
                    dataLabels: {
                        position: 'top',
                    },
                }
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val + "개";
                },
                style: {
                    fontSize: '12px',
                    colors: ["#304758"]
                }
            },
            colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'].slice(0, data.length),
            xaxis: {
                categories: labels,
            },
            yaxis: {
                labels: {
                    style: {
                        fontSize: '12px'
                    }
                }
            },
            tooltip: {
                y: {
                    formatter: function (value) {
                        return value + "개";
                    }
                }
            }
        };

        return (
            <div className="p-4 bg-white rounded-lg shadow h-80">
                <h3 className="text-lg font-bold mb-3">인기 메뉴 조합</h3>
                <Chart
                    options={options}
                    series={series}
                    type="bar"
                    height="90%"
                    width="100%"
                />
            </div>
        );
    };

    // 인기 메뉴 조합 매트릭스 차트
    const renderComboMatrixChart = () => {
        const currentData = getCurrentData();
        if (!currentData || !currentData.topCombos || currentData.topCombos.length === 0) {
            // 데이터가 없을 때 표시할 내용
            return (
                <div className="p-4 bg-white rounded-lg shadow h-80 flex flex-col items-center justify-center">
                    <h3 className="text-lg font-bold mb-3">인기 메뉴 조합 매트릭스</h3>
                    <div className="relative w-40 h-40">
                        <svg className="w-full h-full text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path
                                d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"/>
                        </svg>
                    </div>
                    <p className="text-gray-500 mt-4 text-center">데이터가 없습니다</p>
                </div>
            );
        }

        // 데이터 준비: 메뉴 조합과 판매량, 수익 계산
        const comboData = currentData.topCombos;
        const comboSales = currentData[`${dateView.replace('ly', '')}_combo_sales`] || [];

        // 판매량과 매출액을 함께 표시할 데이터 구성
        const series = [{
            name: '판매 수량',
            data: comboData.map((combo, index) => ({
                x: combo[0][0],
                y: combo[0][1],
                z: combo[1],
                sales: comboSales[index] ? comboSales[index][1] : 0
            }))
        }];

        const options = {
            chart: {
                type: 'bubble',
                height: 350,
                toolbar: {
                    show: false
                }
            },
            dataLabels: {
                enabled: false
            },
            fill: {
                opacity: 0.8,
                type: 'gradient'
            },
            // title: {
            //     text: '인기 메뉴 조합 매트릭스',
            //     align: 'center',
            //     style: {
            //         fontSize: '16px'
            //     }
            // },
            xaxis: {
                title: {
                    text: '메뉴 아이템 1'
                },
                tickAmount: 12
            },
            yaxis: {
                title: {
                    text: '메뉴 아이템 2'
                },
                max: 70
            },
            tooltip: {
                custom: function ({series, seriesIndex, dataPointIndex, w}) {
                    const data = w.config.series[seriesIndex].data[dataPointIndex];
                    const sales = new Intl.NumberFormat('ko-KR').format(data.sales);

                    return `
          <div class="p-2 bg-white shadow rounded">
            <div class="font-bold">${data.x} + ${data.y}</div>
            <div>판매량: ${data.z}개</div>
            <div>매출액: ${sales}원</div>
          </div>
        `;
                }
            },
            theme: {
                palette: 'palette1'
            }
        };

        return (
            <div className="p-4 bg-white rounded-lg shadow h-80">
                <h3 className="text-lg font-bold mb-3">인기 메뉴 조합</h3>
                <Chart
                    options={options}
                    series={series}
                    type="bubble"
                    height="90%"
                    width="100%"
                />
            </div>
        );
    };


    // 날짜 변경 시 데이터 갱신
    useEffect(() => {
        if (isAnalysisRequested) {
            fetchSalesData();
        }
    }, [dateView, startDate]);

    // KPI 카드 컴포넌트
    const KPICard = ({title, value, change, color}) => {
        const isPositive = change >= 0;

        return (
            <div className="bg-white rounded-lg shadow p-4 flex flex-col">
                <div className="flex items-center justify-between mb-2">
                    <div className="text-gray-500 text-sm font-medium">{title}</div>
                    <div className={`p-2 rounded-full bg-${color}-100`}>
                        <svg className={`w-5 h-5 text-${color}-500`} fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            <path fillRule="evenodd"
                                  d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h6a1 1 0 100-2H3zm0 4a1 1 0 100 2h10a1 1 0 100-2H3z"
                                  clipRule="evenodd"/>
                        </svg>
                    </div>
                </div>
                <div className="text-2xl font-bold mb-1">{value}</div>
                <div className="flex items-center">
                    {isPositive ? (
                        <svg className="w-4 h-4 text-green-500 mr-1" fill="none" stroke="currentColor"
                             viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"/>
                        </svg>
                    ) : (
                        <svg className="w-4 h-4 text-red-500 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                                  d="M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"/>
                        </svg>
                    )}
                    <span className={isPositive ? "text-green-500" : "text-red-500"}>
            {isPositive ? "+" : ""}{change}%
          </span>
                    <span className="text-gray-500 text-xs ml-1">vs 이전 주</span>
                </div>
            </div>
        );
    };

    // KPI 카드 렌더링
    const renderKPICards = () => {
        const currentData = getCurrentData();
        if (!currentData) return null;

        const periodLabel = dateView === 'daily' ? '일일' :
            dateView === 'weekly' ? '주간' : '월간';

        const totalOrders = currentData.orders.length || 0;
        const avgOrderValue = totalOrders > 0 ? currentData.sales / totalOrders : 0;

        return (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <KPICard
                    title={`${periodLabel} 총매출`}
                    value={`${currentData.sales.toLocaleString()}원`}
                    change={5.2}
                    color="blue"
                />
                <KPICard
                    title={`${periodLabel} 거래 건수`}
                    value={`${totalOrders}건`}
                    change={3.1}
                    color="green"
                />
                <KPICard
                    title="평균 거래 금액"
                    value={`${Math.round(avgOrderValue).toLocaleString()}원`}
                    change={2.0}
                    color="purple"
                />
                <KPICard
                    title="피크 시간"
                    value={getPeakHour(currentData.salesByTime)}
                    change={-1.5}
                    color="orange"
                />
            </div>
        );
    };

    // 피크 시간 구하기
    const getPeakHour = (salesByTime) => {
        if (!salesByTime || salesByTime.length === 0) return "N/A";

        let maxSales = 0;
        let peakHour = 0;

        salesByTime.forEach(item => {
            if (item.sales > maxSales) {
                maxSales = item.sales;
                peakHour = item.hour;
            }
        });

        return `${peakHour}시`;
    };

    // 인기 메뉴 조합 표시
    const renderTopCombos = () => {
        const currentData = getCurrentData();
        if (!currentData || !currentData.topCombos || currentData.topCombos.length === 0) return null;

        return (
            <div className="md:col-span-2 p-4 bg-white rounded-lg shadow">
                <h3 className="text-lg font-bold mb-3">인기 메뉴 조합 TOP 5</h3>
                <ul className="list-disc pl-5">
                    {currentData.topCombos.map((combo, idx) => (
                        <li key={idx} className="mb-2">
                            {combo[0][0]} + {combo[0][1]}: {combo[1]}개
                        </li>
                    ))}
                </ul>
            </div>
        );
    };

    // 매출 분석 API 호출 (LangChain)
    const fetchSalesAnalysis = async () => {
        // 여기서는 파라미터로부터 분석 데이터 생성 (실제로는 별도 API 호출)
        const sections = [
            {
                title: "매출 요약 및 주요 지표 분석",
                content: "- 일일 총매출: 954원\n- 거래 건수: 43건\n- 평균 거래 금액: 22.19원 (총매출 954원 / 거래 건수 43건)\n- 시간대별 매출 비율:\n  - 오전: 35.0%\n  - 오후: 34.4%\n  - 저녁: 30.7%"
            },
            {
                title: "시간대별 매출 패턴 분석",
                content: "- 오전(8-12시) 매출이 가장 높으며, 특히 9시(8,943원)와 10시(9,124원)에서 매출이 정점에 도달.\n- 오후(12-17시) 매출은 점차 감소하는 경향을 보이며, 13시(6,234원)에서 가장 낮은 매출 기록.\n- 저녁(17-20시) 매출은 다시 상승세를 보이나, 여전히 오전 매출에는 미치지 못함."
            },
            {
                title: "인기 메뉴 및 메뉴 조합 분석",
                content: "- 인기 메뉴:\n  1. 커피: 26개\n  2. 도넛: 11개\n  3. 케이크: 9개\n  4. 주스: 6개\n  5. 샌드위치: 5개\n- 인기 메뉴 조합:\n  1. ('커피', '케이크'): 8개\n  2. ('샌드위치', '주스'): 5개\n  3. ('도넛', '커피'): 5개\n  4. ('마카롱', '커피'): 2개\n  5. ('마카롱', '크로플'): 2개"
            },
            {
                title: "개선을 위한 구체적인 액션 아이템 5가지",
                content: "1. 오전 시간대에 프로모션을 강화하여 고객 유입을 늘리기. 예: 커피와 케이크 세트 할인.\n2. 오후 시간대의 매출 감소를 막기 위해 점심시간에 맞춘 특별 메뉴 출시. 예: 샌드위치와 주스 조합 할인.\n3. 인기 메뉴인 커피와 도넛의 조합을 활용한 패키지 상품 개발.\n4. 저녁 시간대에 방문 고객을 위한 로열티 프로그램 도입. 예: 저녁 5시 이후 방문 시 적립 포인트 제공.\n5. 고객 피드백을 통해 메뉴 개선 및 신규 메뉴 개발. 인기 메뉴에 대한 고객 선호도 조사 실시."
            },
            {
                title: "내일의 매출 증대를 위한 즉각적인 조치 3가지",
                content: "1. 오전 시간대에 커피 구매 시 케이크 무료 제공 프로모션 실시.\n2. 오후 시간대에 방문 고객에게 10% 할인 쿠폰 제공하여 유입 촉진.\n3. 저녁 시간대에 SNS를 통해 특별 이벤트 홍보. 예: 저녁 6시 이후 방문 시 음료 1+1 행사."
            }
        ];

        setAnalysisData(sections);
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

    // 날짜 포맷 헬퍼 함수
    const formatDate = (date) => {
        return new Intl.DateTimeFormat('ko-KR', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(date);
    };

    // 현재 표시 중인 기간 계산
    const getDisplayPeriod = () => {
        const currentDate = new Date(startDate);

        if (dateView === 'daily') {
            return formatDate(currentDate);
        } else if (dateView === 'weekly') {
            const firstDay = new Date(currentDate);
            firstDay.setDate(currentDate.getDate() - currentDate.getDay());

            const lastDay = new Date(firstDay);
            lastDay.setDate(firstDay.getDate() + 6);

            return `${formatDate(firstDay)} ~ ${formatDate(lastDay)}`;
        } else if (dateView === 'monthly') {
            const year = currentDate.getFullYear();
            const month = currentDate.getMonth();
            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);

            return `${formatDate(firstDay)} ~ ${formatDate(lastDay)}`;
        }

        return '';
    };

    // 이전/다음 기간으로 이동 함수를 다음과 같이 수정
    const navigatePeriod = (direction) => {
        // 오늘 날짜 구하기
        const today = new Date();
        today.setHours(0, 0, 0, 0); // 시간 부분 초기화하여 날짜만 비교

        const newDate = new Date(startDate);

        if (dateView === 'daily') {
            newDate.setDate(newDate.getDate() + direction);
        } else if (dateView === 'weekly') {
            newDate.setDate(newDate.getDate() + (direction * 7));
        } else if (dateView === 'monthly') {
            newDate.setMonth(newDate.getMonth() + direction);
        }

        // 미래 날짜인지 확인 (direction이 양수인 경우)
        // 날짜 문자열 비교 방식으로 수정
        if (direction > 0) {
          const todayString = formatDateString(today);
          const newDateString = formatDateString(newDate);

          if (newDateString > todayString) {
            return;
          }
        }

        // 미래 날짜가 아니면 상태 업데이트
        setStartDate(newDate);
    };


    // 매출 분석 버튼 컴포넌트
    const AnalysisButton = () => {
        return (
            <button
                onClick={fetchSalesData}
                disabled={loading}
                className={`flex items-center justify-center px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
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
                    '매출 분석하기'
                )}
            </button>
        );
    };

    return (
        <div className="p-4 bg-gray-50">
            <h2 className="text-2xl font-bold mb-6 text-center">매출 분석 대시보드</h2>

            {/* 날짜 조회 필터 */}
            <div className="flex flex-wrap items-center justify-between mb-6 bg-white p-4 rounded-lg shadow">
                <div className="flex items-center">
                    <button
                        className="px-3 py-1 bg-gray-200 rounded-l-lg hover:bg-gray-300"
                        onClick={() => navigatePeriod(-1)}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7"/>
                        </svg>
                    </button>
                    <span className="px-4 py-1 border-t border-b border-gray-300 font-medium">
            {getDisplayPeriod()}
          </span>
                    <button
                        className="px-3 py-1 bg-gray-200 rounded-r-lg hover:bg-gray-300"
                        onClick={() => navigatePeriod(1)}
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"
                             xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7"/>
                        </svg>
                    </button>
                </div>

                <div className="flex items-center mt-2 sm:mt-0">
                    <label htmlFor="date-view" className="mr-2 text-gray-700">조회 단위:</label>
                    <div className="relative">
                        <select
                            id="date-view"
                            value={dateView}
                            onChange={(e) => setDateView(e.target.value)}
                            className="appearance-none bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:border-blue-500"
                        >
                            <option value="daily">일별</option>
                            <option value="weekly">주별</option>
                            <option value="monthly">월별</option>
                        </select>
                        <div
                            className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                            <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg"
                                 viewBox="0 0 20 20">
                                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/>
                            </svg>
                        </div>
                    </div>
                </div>
            </div>

            {/* 매출 분석 버튼 섹션 */}
            {!isAnalysisRequested && (
                <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow mb-6">
                    <div className="text-center mb-6">
                        <h3 className="text-xl font-semibold mb-2">매출 분석을 시작하세요</h3>
                        <p className="text-gray-600 mb-4">선택한 기간의 매출 데이터를 분석하여 인사이트를 제공합니다.</p>
                    </div>
                    <AnalysisButton/>
                </div>
            )}

            {/* 로딩 표시 */}
            {loading && (
                <div className="flex flex-col items-center justify-center p-10 bg-white rounded-lg shadow mb-6">
                    <svg className="animate-spin h-16 w-16 text-blue-500 mb-4" xmlns="http://www.w3.org/2000/svg"
                         fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <p className="text-lg font-medium text-gray-700">매출 데이터 분석 중...</p>
                    <p className="text-sm text-gray-500 mt-2">잠시만 기다려주세요.</p>
                </div>
            )}

            {/* 분석 결과 표시 */}
            {!loading && isAnalysisRequested && salesData && (
                <>
                    {/* KPI 카드 섹션 */}
                    {renderKPICards && renderKPICards()}

                    {/* 통합 대시보드 차트 (누적 매출 + 시간별 매출) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {renderDashboardChart()}
                    </div>

                    {/* 개별 차트 섹션 */}
                    {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">*/}
                    {/*    {renderCumulativeChart()}*/}
                    {/*    {renderTimeChart()}*/}
                    {/*</div>*/}

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {renderSalesRatioChart()}
                        {renderOrdersChart()}

                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {renderPopularMenuChart()}
                        {renderComboChart()}

                    </div>

                    {/*<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">*/}
                    {/*    /!* 인기 메뉴 조합 *!/*/}
                    {/*    {renderTopCombos()}*/}
                    {/*</div>*/}

                    {/* 나머지 섹션 (분석 탭, 컨텐츠 등) */}
                </>
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
    );
};

export default SalesAnalysis;
