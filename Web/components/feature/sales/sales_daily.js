'use client'
import Chart from "react-apexcharts";
import React, { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase';
import { chartData, chartData2, chartData3 } from './chartData';
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
import { FaCalendarAlt, FaChartLine, FaChartBar, FaShoppingCart, FaMoneyBillWave } from "react-icons/fa";
import CountUp from "react-countup";
import "react-day-picker/dist/style.css";

// 커스텀 Caption 컴포넌트 정의
function CustomCaption(props) {
    const { displayMonth, localeUtils, onClick } = props;

    // 2025년 5월 형식으로 포맷팅
    const formattedMonth = format(displayMonth, 'yyyy년 M월', { locale: ko });

    return (
        <div className="flex justify-between items-center px-1">
            <h3 className="text-base font-bold text-slate-800">{formattedMonth}</h3>
            <div className="flex space-x-1">
                <button
                    onClick={() => onClick('prev')}
                    className="p-1 rounded-md hover:bg-slate-100"
                >
                    <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
                <button
                    onClick={() => onClick('next')}
                    className="p-1 rounded-md hover:bg-slate-100"
                >
                    <svg className="w-5 h-5 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </button>
            </div>
        </div>
    );
}

export default function SalesDaily() {
    const [isLine, setIsLine] = useState(true);
    const [isLoading, setIsLoading] = useState(true);
    const [calendarOpen, setCalendarOpen] = useState(false);
    const [orders, setOrders] = useState({ orders: [], result: {}, cumulative: {}, orderByTime: {} });
    const [totalSales, setTotalSales] = useState(0);
    const [totalOrders, setTotalOrders] = useState(0);
    const [avgOrderValue, setAvgOrderValue] = useState(0);

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const [selectedDay, setSelectedDay] = useState(today);
    const [formattedDate, setFormattedDate] = useState(`${yyyy}-${mm}-${dd}`);

    // 날짜 선택 핸들러
    const handleDaySelect = (day) => {
        if (day) {
            setSelectedDay(day);
            setFormattedDate(format(day, 'yyyy-MM-dd'));
            setCalendarOpen(false);
        }
    };

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoading(true);
            try {
                const { data: { user } } = await supabaseClient.auth.getUser();
                if (user) {
                    const { data: u_data } = await supabaseClient.from('profile_data').select(`*`).eq('id', user.id).single();
                    var b_id = u_data.b_id;

                    const { data } = await supabaseClient
                        .from('order_data')
                        .select("*")
                        .eq('b_id', b_id)
                        .eq('status', "check")
                        .like('time', `%${formattedDate}%`)
                        .order("id", { ascending: false });

                    const result = {};
                    const orderByTime = {};
                    let dailyTotal = 0;

                    data.forEach(item => {
                        const timeKey = item.time.slice(0, 13);
                        const prices = item.price.split(',').filter(p => p !== '').map(Number);
                        const counts = item.count.split(',').filter(c => c !== '').map(Number);

                        const total = prices.reduce((sum, price, idx) => {
                            const count = counts[idx] ?? 0;
                            const validPrice = isNaN(price) ? 0 : price;
                            const validCount = isNaN(count) ? 0 : count;
                            return sum + (validPrice * validCount);
                        }, 0);

                        dailyTotal += total;

                        if (result[timeKey]) {
                            result[timeKey] += total;
                        } else {
                            result[timeKey] = total;
                        }

                        if (orderByTime[timeKey]) {
                            orderByTime[timeKey] += 1;
                        } else {
                            orderByTime[timeKey] = 1;
                        }
                    });

                    // 데이터 처리
                    const todayStr = new Date().toISOString().slice(0, 10);
                    const isBeforeToday = formattedDate < todayStr;
                    const now = new Date();
                    const currentHour = now.getHours();

                    const fullResult = {};
                    const fullOrderByTime = {};
                    const cumulative = {};
                    let runningTotal = 0;
                    for (let hour = 8; hour <= 20; hour++) {
                        const hourStr = String(hour).padStart(2, '0');
                        const timeKey = `${formattedDate} ${hourStr}`;

                        if (isBeforeToday || hour <= currentHour) {
                            fullResult[timeKey] = result[timeKey] || 0;
                            fullOrderByTime[timeKey] = orderByTime[timeKey] || 0;
                            runningTotal += result[timeKey] || 0;
                            cumulative[timeKey] = runningTotal;
                        } else {
                            fullResult[timeKey] = null;
                            fullOrderByTime[timeKey] = null;
                            cumulative[timeKey] = null;
                        }
                    }

                    // KPI 값 설정
                    setTotalSales(dailyTotal);
                    setTotalOrders(data.length);
                    setAvgOrderValue(data.length > 0 ? Math.round(dailyTotal / data.length) : 0);

                    setOrders({ orders: data, result: fullResult, cumulative, orderByTime: fullOrderByTime });
                }
            } catch (error) {
                console.error("매출 데이터 조회 중 오류:", error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchOrders();
    }, [formattedDate]);

    return (
        <div className="flex flex-col space-y-6">
            {/* 날짜 선택기 */}
            <div className="flex items-center justify-between">
                <div className="relative">
                    <button
                        onClick={() => setCalendarOpen(!calendarOpen)}
                        className="flex items-center px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
                    >
                        <FaCalendarAlt className="h-4 w-4 text-slate-500 mr-2" />
                        <span className="text-sm font-medium">{format(selectedDay, 'yyyy년 MM월 dd일')}</span>
                    </button>

                    {calendarOpen && (
                        <div className="absolute left-0 mt-2 z-10 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-[320px] animate-fadeIn">
                            <DayPicker
                                mode="single"
                                selected={selectedDay}
                                onSelect={handleDaySelect}
                                locale={ko}
                                disabled={{ after: new Date() }}
                                className="custom-daypicker"
                                components={{
                                    Caption: CustomCaption
                                }}
                                styles={{
                                    head_cell: { width: '2.5rem', fontSize: '0.875rem' },
                                    cell: { width: '2.5rem', height: '2.5rem' },
                                    day: { width: '2.5rem', height: '2.5rem' },
                                }}
                                modifiersStyles={{
                                    selected: {
                                        backgroundColor: '#3b82f6',
                                        color: 'white',
                                        fontWeight: 'bold',
                                        borderRadius: '2.5rem'
                                    },
                                    today: {
                                        color: '#3b82f6',
                                        fontWeight: 'bold'
                                    },
                                    disabled: {
                                        color: '#cbd5e1',
                                        cursor: 'not-allowed'
                                    }
                                }}
                            />

                        </div>
                    )}
                </div>

            </div>

            {/* 매출 요약 카드 */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                {/* 총 매출 카드 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px] flex flex-col justify-between">
                    <div className="p-6 flex-1">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-semibold text-slate-500">총 매출</h2>
                            <div className="p-2 bg-blue-500/10 rounded-full">
                                <FaMoneyBillWave className="h-5 w-5 text-blue-500" />
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <CountUp
                                duration={2}
                                end={totalSales}
                                separator=","
                                className="text-3xl font-bold text-slate-800"
                            />
                            <span className="ml-1 text-lg font-medium text-slate-800">원</span>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-slate-500">
                            <span>일일 매출액</span>
                        </div>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 w-full"></div>
                </div>

                {/* 주문 수 카드 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px] flex flex-col justify-between">
                    <div className="p-6 flex-1">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-semibold text-slate-500">주문 수</h2>
                            <div className="p-2 bg-green-500/10 rounded-full">
                                <FaShoppingCart className="h-5 w-5 text-green-500" />
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <CountUp
                                duration={2}
                                end={totalOrders}
                                className="text-3xl font-bold text-slate-800"
                            />
                            <span className="ml-1 text-lg font-medium text-slate-800">건</span>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-slate-500">
                            <span>일일 주문 건수</span>
                        </div>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-green-500 to-green-600 w-full"></div>
                </div>

                {/* 평균 주문 금액 카드 */}
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px] flex flex-col justify-between">
                    <div className="p-6 flex-1">
                        <div className="flex items-center justify-between mb-3">
                            <h2 className="text-sm font-semibold text-slate-500">평균 주문 금액</h2>
                            <div className="p-2 bg-amber-500/10 rounded-full">
                                <FaChartBar className="h-5 w-5 text-amber-500" />
                            </div>
                        </div>
                        <div className="flex items-baseline">
                            <CountUp
                                duration={2}
                                end={avgOrderValue}
                                separator=","
                                className="text-3xl font-bold text-slate-800"
                            />
                            <span className="ml-1 text-lg font-medium text-slate-800">원</span>
                        </div>
                        <div className="mt-2 flex items-center text-sm text-slate-500">
                            <span>주문당 평균 금액</span>
                        </div>
                    </div>
                    <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-600 w-full"></div>
                </div>
            </div>

            {/* 로딩 상태 */}
            {isLoading ? (
                <div className="flex justify-center items-center p-12">
                    <div className="w-16 h-16 rounded-full animate-spin border-2 border-solid border-blue-500 border-t-transparent"></div>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* 누적 매출 차트 */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex items-center space-x-2 mb-4">
                            <FaChartLine className="h-5 w-5 text-blue-500" />
                            <h3 className="font-bold text-slate-800">누적 매출</h3>
                        </div>
                        <Chart
                            key={isLine ? 'area' : 'bar'}
                            type={isLine ? "area" : "bar"}
                            options={{
                                ...chartData(formattedDate, orders).options,
                                chart: {
                                    ...chartData(formattedDate, orders).options.chart,
                                    toolbar: { show: false },
                                    fontFamily: 'Pretendard, sans-serif',
                                },
                                colors: ['#3b82f6'],
                                grid: {
                                    borderColor: '#e2e8f0',
                                    strokeDashArray: 5,
                                },
                                fill: {
                                    type: 'gradient',
                                    gradient: {
                                        shadeIntensity: 1,
                                        opacityFrom: 0.7,
                                        opacityTo: 0.3,
                                        stops: [0, 90, 100]
                                    }
                                },
                                tooltip: {
                                    y: { formatter: value => `${value.toLocaleString()}원` }
                                }
                            }}
                            series={chartData(formattedDate, orders).series}
                            height={300}
                        />
                    </div>

                    {/* 시간대별 매출 차트 */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex items-center space-x-2 mb-4">
                            <FaChartBar className="h-5 w-5 text-green-500" />
                            <h3 className="font-bold text-slate-800">시간대별 매출</h3>
                        </div>
                        <Chart
                            key={isLine ? 'line-2' : 'bar-2'}
                            type={isLine ? "line" : "bar"}
                            options={{
                                ...chartData2(formattedDate, orders).options,
                                chart: {
                                    ...chartData2(formattedDate, orders).options.chart,
                                    toolbar: { show: false },
                                    fontFamily: 'Pretendard, sans-serif',
                                },
                                colors: ['#10b981'],
                                grid: {
                                    borderColor: '#e2e8f0',
                                    strokeDashArray: 5,
                                },
                                tooltip: {
                                    y: { formatter: value => `${value.toLocaleString()}원` }
                                }
                            }}
                            series={chartData2(formattedDate, orders).series}
                            height={300}
                        />
                    </div>

                    {/* 시간대별 주문 차트 */}
                    <div className="bg-white p-6 rounded-xl shadow-sm">
                        <div className="flex items-center space-x-2 mb-4">
                            <FaChartBar className="h-5 w-5 text-amber-500" />
                            <h3 className="font-bold text-slate-800">시간대별 주문</h3>
                        </div>
                        <Chart
                            key={isLine ? 'line-3' : 'bar-3'}
                            type={isLine ? "line" : "bar"}
                            options={{
                                ...chartData3(formattedDate, orders).options,
                                chart: {
                                    ...chartData3(formattedDate, orders).options.chart,
                                    toolbar: { show: false },
                                    fontFamily: 'Pretendard, sans-serif',
                                },
                                colors: ['#f59e0b'],
                                grid: {
                                    borderColor: '#e2e8f0',
                                    strokeDashArray: 5,
                                },
                                tooltip: {
                                    y: { formatter: value => `${value}건` }
                                }
                            }}
                            series={chartData3(formattedDate, orders).series}
                            height={300}
                        />
                    </div>
                </div>
            )}
        </div>
    );
}
