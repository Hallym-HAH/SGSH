import React, {useState, useEffect} from 'react';
import Chart from 'react-apexcharts';
import {chartData, chartData2, chartData3} from './chartData';

const SalesAnalysis = () => {
    const [analysisData, setAnalysisData] = useState(null);
    const [loading, setLoading] = useState(false); // 초기값을 false로 변경
    const [error, setError] = useState(null);
    const [activeSection, setActiveSection] = useState(0);
    const [dateView, setDateView] = useState('daily');
    const [startDate, setStartDate] = useState(new Date());
    const [ordersData, setOrdersData] = useState({
        cumulative: {},
        result: {},
        orderByTime: {}
    });
    const [isAnalysisRequested, setIsAnalysisRequested] = useState(false);

    // API 호출 및 데이터 가져오기 함수
    const fetchSalesAnalysis = async () => {
        try {
            setLoading(true);
            setIsAnalysisRequested(true);

            // 실제 API 호출 시 지연 시간 시뮬레이션 (실제 구현에선 제거)
            await new Promise(resolve => setTimeout(resolve, 2000));

            // 실제 애플리케이션에서는 아래와 같이 API를 호출합니다
            // const response = await fetch('/api/sales/analysis');
            // const data = await response.text();

            // 목업 데이터
            const data = `### 1. 매출 요약 및 주요 지표 분석
            - 일일 총매출: 954원
            - 거래 건수: 43건
            - 평균 거래 금액: 22.19원 (총매출 954원 / 거래 건수 43건)
            - 시간대별 매출 비율:
              - 오전: 35.0%
              - 오후: 34.4%
              - 저녁: 30.7%
            
            ### 2. 시간대별 매출 패턴 분석
            - 오전(8-12시) 매출이 가장 높으며, 특히 9시(8,943원)와 10시(9,124원)에서 매출이 정점에 도달.
            - 오후(12-17시) 매출은 점차 감소하는 경향을 보이며, 13시(6,234원)에서 가장 낮은 매출 기록.
            - 저녁(17-20시) 매출은 다시 상승세를 보이나, 여전히 오전 매출에는 미치지 못함.
            
            ### 3. 인기 메뉴 및 메뉴 조합 분석
            - 인기 메뉴:
              1. 커피: 26개
              2. 도넛: 11개
              3. 케이크: 9개
              4. 주스: 6개
              5. 샌드위치: 5개
            - 인기 메뉴 조합:
              1. ('커피', '케이크'): 8개
              2. ('샌드위치', '주스'): 5개
              3. ('도넛', '커피'): 5개
              4. ('마카롱', '커피'): 2개
              5. ('마카롱', '크로플'): 2개
            
            ### 4. 개선을 위한 구체적인 액션 아이템 5가지
            1. 오전 시간대에 프로모션을 강화하여 고객 유입을 늘리기. 예: 커피와 케이크 세트 할인.
            2. 오후 시간대의 매출 감소를 막기 위해 점심시간에 맞춘 특별 메뉴 출시. 예: 샌드위치와 주스 조합 할인.
            3. 인기 메뉴인 커피와 도넛의 조합을 활용한 패키지 상품 개발.
            4. 저녁 시간대에 방문 고객을 위한 로열티 프로그램 도입. 예: 저녁 5시 이후 방문 시 적립 포인트 제공.
            5. 고객 피드백을 통해 메뉴 개선 및 신규 메뉴 개발. 인기 메뉴에 대한 고객 선호도 조사 실시.
            
            ### 5. 내일의 매출 증대를 위한 즉각적인 조치 3가지
            1. 오전 시간대에 커피 구매 시 케이크 무료 제공 프로모션 실시.
            2. 오후 시간대에 방문 고객에게 10% 할인 쿠폰 제공하여 유입 촉진.
            3. 저녁 시간대에 SNS를 통해 특별 이벤트 홍보. 예: 저녁 6시 이후 방문 시 음료 1+1 행사.`;

            // 데이터를 섹션별로 분할
            const sections = data.split(/(?=### \d\.)/g).filter(Boolean);
            const processedSections = sections.map(section => {
                const titleMatch = section.match(/### \d\. (.*)/);
                const title = titleMatch ? titleMatch[1].trim() : '';
                const content = section.replace(/### \d\. .*\n/, '').trim();

                return {title, content};
            });

            setAnalysisData(processedSections);

            // 차트 데이터도 함께 가져오기
            fetchSalesData();
        } catch (error) {
            console.error("매출 분석 데이터 가져오기 실패:", error);
            setError("데이터를 불러오는 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    const fetchSalesData = async () => {
        try {
            const formattedDate = formatDateString(startDate);
            // 목업 데이터
            const data = {
                cumulative: {
                    [`${formattedDate} 08`]: 1500,
                    [`${formattedDate} 09`]: 3500,
                    [`${formattedDate} 10`]: 5000,
                    [`${formattedDate} 11`]: 6500,
                    [`${formattedDate} 12`]: 8000,
                    [`${formattedDate} 13`]: 9000,
                },
                result: {
                    [`${formattedDate} 08`]: 1500,
                    [`${formattedDate} 09`]: 2000,
                    [`${formattedDate} 10`]: 1500,
                    [`${formattedDate} 11`]: 1500,
                    [`${formattedDate} 12`]: 1500,
                    [`${formattedDate} 13`]: 1000,
                },
                orderByTime: {
                    [`${formattedDate} 08`]: 5,
                    [`${formattedDate} 09`]: 7,
                    [`${formattedDate} 10`]: 6,
                    [`${formattedDate} 11`]: 5,
                    [`${formattedDate} 12`]: 8,
                    [`${formattedDate} 13`]: 4,
                }
            };
            setOrdersData(data);
        } catch (error) {
            console.error("매출 데이터 가져오기 실패:", error);
            setError("데이터를 불러오는 중 오류가 발생했습니다.");
        }
    };

    // YYYY-MM-DD 형식으로 날짜 변환
    const formatDateString = (date) => {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
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

    // 이전/다음 기간으로 이동
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
        if (direction > 0) {
            // 새 날짜가 오늘보다 미래인 경우 업데이트 안함
            if (newDate > today) {
                return; // 함수 종료, 상태 업데이트 하지 않음
            }
        }

        // 미래 날짜가 아니면 상태 업데이트
        setStartDate(newDate);
    };

    // 매출 분석 버튼 컴포넌트
    const AnalysisButton = () => {
        return (
            <button
                onClick={fetchSalesAnalysis}
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


    // KPI 카드 컴포넌트
    const KPICard = ({title, value, change, color}) => {
        const isPositive = change >= 0;

        // 색상 이름을 클래스 이름으로 매핑
        const colorClasses = {
            'orange': {bg: 'bg-orange-100', text: 'text-orange-500'},
            'blue': {bg: 'bg-blue-100', text: 'text-blue-500'},
            'red': {bg: 'bg-red-100', text: 'text-red-500'},
            'green': {bg: 'bg-green-100', text: 'text-green-500'},
            'purple': {bg: 'bg-purple-100', text: 'text-purple-500'},
        };

        // 매핑된 클래스 사용 (없으면 기본값)
        const bgClass = colorClasses[color]?.bg || 'bg-gray-100';
        const textClass = colorClasses[color]?.text || 'text-gray-500';

        return (
            <div className="bg-white rounded-lg shadow p-4 flex flex-col">
                {/* 여기서 문자열 보간 대신 변수 사용 */}
                <div className="flex items-center justify-between mb-2">
                    <div className="text-gray-500 text-sm font-medium">{title}</div>
                    <div className={`p-2 rounded-full ${bgClass}`}>
                        <svg className={`w-5 h-5 ${textClass}`} fill="currentColor" viewBox="0 0 20 20"
                             xmlns="http://www.w3.org/2000/svg">
                            {/* SVG 경로 */}
                            <path fillRule="evenodd"
                                  d="M3 3a1 1 0 000 2h10a1 1 0 100-2H3zm0 4a1 1 0 000 2h6a1 1 0 100-2H3zm0 4a1 1 0 100 2h10a1 1 0 100-2H3z"
                                  clipRule="evenodd"/>
                        </svg>
                    </div>
                </div>
                {/* 나머지 컴포넌트 코드 */}
                <div className="text-2xl font-bold mb-1">{value}</div>
                <div className="flex items-center">
                    {/* 기존 코드와 동일 */}
                    {/* ... */}
                </div>
            </div>
        );
    };


    // 시간대별 매출 패턴 차트
    const renderTimeChart = () => {
        const formattedDate = formatDateString(startDate);
        const chartConfig = chartData2(formattedDate, ordersData);

        return (
            <div className="p-4 bg-white rounded-lg shadow h-80">
                <Chart
                    options={chartConfig.options}
                    series={chartConfig.series}
                    type="line"
                    height="100%"
                />
            </div>
        );
    };

    // 누적 매출 차트
    const renderCumulativeChart = () => {
        const formattedDate = formatDateString(startDate);
        const chartConfig = chartData(formattedDate, ordersData);

        return (
            <div className="p-4 bg-white rounded-lg shadow h-80">
                <Chart
                    options={chartConfig.options}
                    series={chartConfig.series}
                    type="line"
                    height="100%"
                />
            </div>
        );
    };

    // 시간대별 주문 차트
    const renderOrdersChart = () => {
        const formattedDate = formatDateString(startDate);
        const chartConfig = chartData3(formattedDate, ordersData);

        return (
            <div className="p-4 bg-white rounded-lg shadow h-80">
                <Chart
                    options={chartConfig.options}
                    series={chartConfig.series}
                    type="line"
                    height="100%"
                />
            </div>
        );
    };


    // 인기 메뉴 차트 (ApexCharts로 변경)
    const renderPopularMenuChart = () => {
        const series = [{
            name: '판매 수량',
            data: [26, 11, 9, 6, 5]
        }];

        const options = {
            chart: {
                type: 'bar',
                toolbar: {
                    show: false
                }
            },
            title: {
                text: '인기 메뉴 TOP 5',
                align: 'center',
                style: {
                    fontSize: '16px'
                }
            },
            plotOptions: {
                bar: {
                    columnWidth: '55%',
                    borderRadius: 4,
                    distributed: true,
                    dataLabels: {
                        position: 'top'
                    }
                }
            },
            colors: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', '#9966FF'],
            xaxis: {
                categories: ['커피', '도넛', '케이크', '주스', '샌드위치'],
                position: 'bottom'
            },
            dataLabels: {
                enabled: true,
                formatter: function (val) {
                    return val + "개";
                },
                offsetY: -20,
                style: {
                    fontSize: '12px',
                    colors: ["#304758"]
                }
            },
            grid: {
                borderColor: '#f1f1f1'
            },
            legend: {
                show: false
            }
        };

        return (
            <div className="p-4 bg-white rounded-lg shadow h-80">
                <Chart options={options} series={series} type="bar" height="100%"/>
            </div>
        );
    };

    // 시간대별 매출 비율 차트 (ApexCharts로 변경)
    const renderSalesRatioChart = () => {
        const series = [35.0, 34.4, 30.7];

        const options = {
            chart: {
                type: 'donut'
            },
            title: {
                text: '시간대별 매출 비율',
                align: 'center',
                style: {
                    fontSize: '16px'
                }
            },
            labels: ['오전', '오후', '저녁'],
            colors: ['#FF9F43', '#4BC0C0', '#9966FF'],
            plotOptions: {
                pie: {
                    donut: {
                        size: '65%',
                        labels: {
                            show: true,
                            name: {
                                show: true
                            },
                            value: {
                                show: true,
                                formatter: function (val) {
                                    return val + '%';
                                }
                            },
                            total: {
                                show: true,
                                label: '총 매출',
                                formatter: function () {
                                    return '100%';
                                }
                            }
                        }
                    }
                }
            },
            dataLabels: {
                enabled: false
            },
            legend: {
                position: 'bottom'
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
                <Chart options={options} series={series} type="donut" height="100%"/>
            </div>
        );
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

            {/* 로딩 중 표시 */}
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

            {!loading && isAnalysisRequested && analysisData && (
                <>
                     {/*KPI 카드 섹션*/}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                        <KPICard
                            title="일일 총매출"
                            value="954원"
                            change={5.2}
                            color="red"
                        />
                        <KPICard
                            title="거래 건수"
                            value="43건"
                            change={3.1}
                            color="green"
                        />
                        <KPICard
                            title="평균 거래 금액"
                            value="22.19원"
                            change={2.0}
                            color="blue"
                        />
                        <KPICard
                            title="피크 시간"
                            value="10시"
                            change={-1.5}
                            color="purple"
                        />
                    </div>

                    {/* 차트 섹션 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                        {renderTimeChart()}
                        {renderPopularMenuChart()}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {renderSalesRatioChart()}
                        <div className="md:col-span-2 p-4 bg-white rounded-lg shadow">
                            <h3 className="text-lg font-bold mb-3">인기 메뉴 조합 TOP 5</h3>
                            <ul className="list-disc pl-5">
                                <li className="mb-2">커피 + 케이크: 8개</li>
                                <li className="mb-2">샌드위치 + 주스: 5개</li>
                                <li className="mb-2">도넛 + 커피: 5개</li>
                                <li className="mb-2">마카롱 + 커피: 2개</li>
                                <li className="mb-2">마카롱 + 크로플: 2개</li>
                            </ul>
                        </div>
                    </div>

                    {/*/!* 차트 섹션 *!/*/}
                    {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">*/}
                    {/*    {renderCumulativeChart()}*/}
                    {/*    {renderTimeChart()}*/}
                    {/*</div>*/}

                    {/*<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">*/}
                    {/*    {renderOrdersChart()}*/}
                    {/*    {renderSalesRatioChart()}*/}
                    {/*</div>*/}

                    {/* 섹션 탭 네비게이션 */}
                    <div className="mb-5">
                        <ul className="flex flex-wrap -mb-px text-sm font-medium text-center border-b border-gray-200"
                            role="tablist">
                            {analysisData.map((section, idx) => (
                                <li key={idx} className="flex-1" role="presentation">
                                    <a
                                        className={
                                            "inline-block w-full p-4 rounded-t-lg " +
                                            (activeSection === idx
                                                ? "text-blue-600 border-b-2 border-blue-600 active"
                                                : "hover:text-gray-600 hover:border-gray-300 border-b-2 border-transparent")
                                        }
                                        onClick={(e) => {
                                            e.preventDefault();
                                            setActiveSection(idx);
                                        }}
                                        href={`#section-${idx}`}
                                        data-toggle="tab"
                                        role="tab"
                                    >
                                        {section.title}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* 섹션 내용 */}
                    <div className="tab-content">
                        {analysisData.map((section, idx) => (
                            <div
                                key={idx}
                                className={`tab-pane ${activeSection === idx ? 'block' : 'hidden'}`}
                                id={`section-${idx}`}
                                role="tabpanel"
                            >
                                <div className="p-4 border border-gray-200 rounded-lg bg-white">
                                    <ul className="list-none">
                                        {renderContent(section.content)}
                                    </ul>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* 다시 분석 버튼 */}
                    <div className="flex justify-end mt-6">
                        <AnalysisButton/>
                    </div>
                </>
            )}

            {/* 오류 표시 */}
            {error && (
                <div className="p-6 text-center text-red-500 bg-white rounded-lg shadow">
                    <svg className="w-12 h-12 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor"
                         viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2"
                              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <h3 className="text-lg font-medium">{error}</h3>
                    <p className="mt-2 text-sm text-gray-600">다시 시도해 보세요.</p>
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