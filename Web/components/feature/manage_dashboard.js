import ManageNavBar from "@/components/feature/manage_navbar";
import { supabaseClient } from "@/lib/supabase";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import Chart from "react-apexcharts";
import { dashboardChartData } from '@/components/feature/sales/chartData';
import CountUp from "react-countup";
import { FaWonSign, FaShoppingCart, FaCalendarCheck, FaEye, FaChartLine, FaChartPie, FaStar } from "react-icons/fa";

export default function ManageDashboard() {
    const [userData, setUserData] = useState({
        b_id: 0,
        proDuration: "",
        isPro: false
    });
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState({ orders: [], result: {}, cumulative: {}, orderByTime: {} });
    const [cOrders, setCOrders] = useState([]);
    const [totalAmount, setTotalAmount] = useState(0);
    const [reserved, setReserved] = useState([]);
    const [hits, setHits] = useState([]);
    const [todayHits, setTodayHits] = useState([]);
    const [bestOrder, setBestOrder] = useState({});

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const [formattedDate, setFormattedDate] = useState(`${yyyy}-${mm}-${dd}`);

    useEffect(() => {
        const fetchMenus = async () => {
            const { data: { user } } = await supabaseClient.auth.getUser()
            if (user) {
                const { data: u_data } = await supabaseClient.from('profile_data').select(`*`).eq('id', user.id).single();
                setUserData({
                    b_id: u_data.b_id,
                    proDuration: u_data.proDuration,
                    isPro: u_data.isPro
                })
                var b_id = u_data.b_id;

                const { data: orders } = await supabaseClient.from('order_data').select("*").eq('b_id', b_id).neq('status', "cancel").like('time', `%${formattedDate}%`).order("id", { ascending: false });
                const { data: c_orders } = await supabaseClient.from('order_data').select("*").eq('b_id', b_id).eq('status', "cancel").like('time', `%${formattedDate}%`).order("id", { ascending: false });
                setCOrders(c_orders);
                const result = {};
                const orderByTime = {};

                orders.forEach(item => {
                    const timeKey = item.time.slice(0, 13);

                    const prices = item.price.split(',').filter(p => p !== '').map(Number);
                    const counts = item.count.split(',').filter(c => c !== '').map(Number);

                    const total = prices.reduce((sum, price, idx) => {
                        const count = counts[idx] ?? 0;
                        const validPrice = isNaN(price) ? 0 : price;
                        const validCount = isNaN(count) ? 0 : count;
                        return sum + (validPrice * validCount);
                    }, 0);

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
                setOrders({ orders: orders, result: fullResult, cumulative, orderByTime: fullOrderByTime });

                var tmpTotalAmount = 0;
                orders.map((order) => {
                    var tmpName = order.name.split(",");
                    var tmpPrice = order.price.split(",");
                    var tmpCount = order.count.split(",");
                    for (let i = 0; i < tmpPrice.length - 1; i++) {
                        tmpTotalAmount += parseInt(tmpPrice[i]) * parseInt(tmpCount[i]);
                    }
                    setTotalAmount(tmpTotalAmount);
                })

                // 수정된 부분: 취소된 예약을 포함하여 가져오기
                const { data: reserveData } = await supabaseClient.from('reserve_data')
                    .select(`*`)
                    .eq('b_id', b_id)
                    .eq('date', formattedDate)  // 선택한 날짜의 예약만 필터링
                    .order("time", { ascending: true });  // 시간순으로 정렬

                setReserved(reserveData);

                const { data: hitsData } = await supabaseClient.from('business_hits').select(`*`).eq('b_id', b_id).order('date', { ascending: false }).limit(7);
                setHits(hitsData);
                console.log(hitsData);

                const { data: todayHitsData } = await supabaseClient.from('business_hits').select(`*`).eq('b_id', b_id).eq('date', formattedDate).maybeSingle();
                setTodayHits(todayHitsData);

                const nameCounter = {};
                orders.forEach(order => {
                    const names = order.name.split(',').filter(name => name.trim() !== '');

                    names.forEach(name => {
                        if (nameCounter[name]) {
                            nameCounter[name]++;
                        } else {
                            nameCounter[name] = 1;
                        }
                    });
                });
                const sortedEntries = Object.entries(nameCounter).sort((a, b) => b[1] - a[1]);
                const sortedNameCount = {};
                sortedEntries.forEach(([name, count]) => {
                    sortedNameCount[name] = count;
                });

                setBestOrder(sortedNameCount)
                setIsLoading(false)
            }
        }

        fetchMenus()
    }, [formattedDate]);

    const sortedData = [...hits].sort((a, b) => new Date(a.date) - new Date(b.date));

    const categories = sortedData.map(item => {
        const dateObj = new Date(item.date);
        const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
        const dd = String(dateObj.getDate()).padStart(2, '0');
        return `${mm}-${dd}`;
    });

    const series = [{
        name: '조회수',
        data: sortedData.map(item => item.hits)
    }];

    const maxHits = Math.max(...sortedData.map(item => item.hits));

    const options = {
        chart: {
            id: "basic-bar",
            type: 'line',
            toolbar: { show: false },
            zoom: { enabled: false, allowMouseWheelZoom: false },
            fontFamily: 'Pretendard, sans-serif',
            background: 'transparent',
            animations: {
                enabled: true,
                easing: 'easeinout',
                speed: 800,
            }
        },
        colors: ['#3b82f6'],
        stroke: {
            curve: 'smooth',
            width: 3
        },
        markers: {
            size: 5,
            colors: ['#3b82f6'],
            strokeWidth: 0,
            hover: { size: 7 }
        },
        xaxis: {
            categories,
            labels: {
                style: {
                    fontSize: '12px',
                    fontWeight: 500,
                    colors: '#64748b'
                }
            },
            axisBorder: { show: false },
            axisTicks: { show: false }
        },
        yaxis: {
            max: maxHits,
            tickAmount: maxHits >= 5 ? 5 : maxHits,
            forceNiceScale: true,
            labels: {
                formatter: function (value) {
                    return Math.round(value);
                },
                style: {
                    fontSize: '12px',
                    fontWeight: 500,
                    colors: '#64748b'
                }
            }
        },
        grid: {
            borderColor: '#e2e8f0',
            strokeDashArray: 5,
            xaxis: { lines: { show: true } },
            yaxis: { lines: { show: true } },
            padding: { top: 0, right: 20, bottom: 0, left: 20 }
        },
        tooltip: {
            style: { fontSize: '14px' },
            y: { formatter: (value) => `${value}회` }
        },
        fill: {
            type: 'gradient',
            gradient: {
                shade: 'light',
                type: 'vertical',
                shadeIntensity: 0.3,
                gradientToColors: ['rgba(59, 130, 246, 0.2)'],
                inverseColors: false,
                opacityFrom: 0.7,
                opacityTo: 0.3,
                stops: [0, 100]
            }
        }
    };

    const dateSelectOptions = () => {
        const today = new Date();
        const options = [];

        for (let i = 0; i < 7; i++) {
            const date = new Date(today);
            date.setDate(today.getDate() - i);
            const yyyy = date.getFullYear();
            const mm = String(date.getMonth() + 1).padStart(2, '0');
            const dd = String(date.getDate()).padStart(2, '0');
            const formattedDate = `${yyyy}-${mm}-${dd}`;
            const displayDate = i === 0 ? '오늘' : `${mm}월 ${dd}일`;

            options.push(
                <option key={i} value={formattedDate}>
                    {displayDate}
                </option>
            );
        }

        return options;
    };

    // 선택된 날짜에서 월과 일 추출
    const selectedDate = new Date(formattedDate);
    const selectedMM = String(selectedDate.getMonth() + 1).padStart(2, '0');
    const selectedDD = String(selectedDate.getDate()).padStart(2, '0');

    // 예약 상태에 따른 카운트
    const validReservations = reserved ? reserved.filter(r => r.status !== "cancel").length : 0;
    const cancelledReservations = reserved ? reserved.filter(r => r.status === "cancel").length : 0;

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
            {isLoading ?
                <div className="flex flex-row mx-auto my-20 md:-my-20 h-screen justify-center md:items-center">
                    <div className="w-40 h-40 rounded-full animate-spin 
                            border-2 border-solid border-blue-500 border-t-transparent"></div>
                </div>
                :
                <div className="container mx-auto">
                    <div className="flex justify-between items-center px-[30px] pt-[30px] mb-2">
                        <h1 className="text-2xl font-bold text-slate-800">대시보드</h1>
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-slate-700">날짜 선택:</label>
                            <select
                                className="px-4 py-2 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                                value={formattedDate}
                                onChange={(e) => setFormattedDate(e.target.value)}
                            >
                                {dateSelectOptions()}
                            </select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 px-[30px] pb-8">
                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px] flex flex-col justify-between">
                            <div className="p-6 flex-1">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-sm font-semibold text-slate-500">총 매출</h2>
                                    <div className="p-2 bg-blue-500/10 rounded-full">
                                        <FaWonSign className="h-5 w-5 text-blue-500" />
                                    </div>
                                </div>
                                <div className="flex items-baseline">
                                    <CountUp
                                        duration={2}
                                        end={totalAmount}
                                        separator=","
                                        className="text-3xl font-bold text-slate-800"
                                    />
                                    <span className="ml-1 text-lg font-medium text-slate-800">원</span>
                                </div>
                                <div className="mt-2 flex items-center text-sm opacity-0">
                                    <span>여백</span>
                                </div>
                            </div>
                            <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 w-full"></div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px] flex flex-col justify-between">
                            <div className="p-6 flex-1">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-sm font-semibold text-slate-500">주문</h2>
                                    <div className="p-2 bg-green-500/10 rounded-full">
                                        <FaShoppingCart className="h-5 w-5 text-green-500" />
                                    </div>
                                </div>
                                <div className="flex items-baseline">
                                    <CountUp
                                        duration={2}
                                        end={orders.orders.length}
                                        className="text-3xl font-bold text-slate-800"
                                    />
                                    <span className="ml-1 text-lg font-medium text-slate-800">건</span>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-red-500">
                                    <span>취소 </span>
                                    <CountUp
                                        duration={2}
                                        end={cOrders.length}
                                        className="ml-1 font-semibold"
                                    />
                                    <span className="font-semibold">건</span>
                                </div>
                            </div>
                            <div className="h-1 bg-gradient-to-r from-green-500 to-green-600 w-full"></div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px] flex flex-col justify-between">
                            <div className="p-6 flex-1">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-sm font-semibold text-slate-500">예약</h2>
                                    <div className="p-2 bg-amber-500/10 rounded-full">
                                        <FaCalendarCheck className="h-5 w-5 text-amber-500" />
                                    </div>
                                </div>
                                <div className="flex items-baseline">
                                    <CountUp
                                        duration={2}
                                        end={validReservations}
                                        className="text-3xl font-bold text-slate-800"
                                    />
                                    <span className="ml-1 text-lg font-medium text-slate-800">건</span>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-red-500">
                                    <span>취소 </span>
                                    <CountUp
                                        duration={2}
                                        end={cancelledReservations}
                                        className="ml-1 font-semibold"
                                    />
                                    <span className="font-semibold">건</span>
                                </div>
                            </div>
                            <div className="h-1 bg-gradient-to-r from-amber-500 to-amber-600 w-full"></div>
                        </div>

                        <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px] flex flex-col justify-between">
                            <div className="p-6 flex-1">
                                <div className="flex items-center justify-between mb-3">
                                    <h2 className="text-sm font-semibold text-slate-500">조회수</h2>
                                    <div className="p-2 bg-purple-500/10 rounded-full">
                                        <FaEye className="h-5 w-5 text-purple-500" />
                                    </div>
                                </div>
                                <div className="flex items-baseline">
                                    <CountUp
                                        duration={2}
                                        end={todayHits ? todayHits.hits : 0}
                                        className="text-3xl font-bold text-slate-800"
                                    />
                                    <span className="ml-1 text-lg font-medium text-slate-800">회</span>
                                </div>
                                <div className="mt-2 flex items-center text-sm text-slate-500">
                                    <span>선택 날짜 조회수</span>
                                </div>
                            </div>
                            <div className="h-1 bg-gradient-to-r from-purple-500 to-purple-600 w-full"></div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 gap-6 px-[30px]">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex justify-between items-center mb-6">
                                <div className="flex items-center space-x-2">
                                    <FaChartLine className="h-6 w-6 text-blue-500" />
                                    <h3 className="text-lg font-bold text-slate-800">누적 매출</h3>
                                </div>
                                <span className="px-3 py-1 text-sm bg-blue-50 text-blue-600 rounded-full font-medium">{formattedDate}</span>
                            </div>
                            <Chart
                                className="w-[100%]"
                                key={'area'}
                                type={'area'}
                                options={{
                                    ...dashboardChartData(formattedDate, orders).options,
                                    chart: {
                                        ...dashboardChartData(formattedDate, orders).options.chart,
                                        toolbar: {
                                            show: false,
                                        },
                                        fontFamily: 'Pretendard, sans-serif',
                                        background: 'transparent',
                                    },
                                    colors: ['#3b82f6', '#f97316'], // 파란색과 주황색으로 구분
                                    stroke: {
                                        curve: 'smooth',
                                        width: 3
                                    },
                                    fill: {
                                        type: 'gradient',
                                        gradient: {
                                            shadeIntensity: 1,
                                            opacityFrom: 0.7,
                                            opacityTo: 0.3,
                                            stops: [0, 90, 100],
                                            colorStops: [
                                                [
                                                    {
                                                        offset: 0,
                                                        color: '#3b82f6',
                                                        opacity: 0.4
                                                    },
                                                    {
                                                        offset: 100,
                                                        color: '#3b82f6',
                                                        opacity: 0.1
                                                    }
                                                ],
                                                [
                                                    {
                                                        offset: 0,
                                                        color: '#f97316',
                                                        opacity: 0.4
                                                    },
                                                    {
                                                        offset: 100,
                                                        color: '#f97316',
                                                        opacity: 0.1
                                                    }
                                                ]
                                            ]
                                        }
                                    },
                                    grid: {
                                        borderColor: '#e2e8f0',
                                        strokeDashArray: 5,
                                        xaxis: { lines: { show: true } },
                                        yaxis: { lines: { show: true } },
                                    },
                                    tooltip: {
                                        style: { fontSize: '14px' },
                                        y: { formatter: (value) => `${value.toLocaleString()}원` }
                                    },
                                    xaxis: {
                                        ...dashboardChartData(formattedDate, orders).options.xaxis,
                                        labels: {
                                            style: {
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                colors: '#64748b'
                                            }
                                        }
                                    },
                                    yaxis: {
                                        ...dashboardChartData(formattedDate, orders).options.yaxis,
                                        labels: {
                                            style: {
                                                fontSize: '12px',
                                                fontWeight: 500,
                                                colors: '#64748b'
                                            },
                                            formatter: function (value) {
                                                return value.toLocaleString() + '원';
                                            }
                                        }
                                    }
                                }}
                                series={dashboardChartData(formattedDate, orders).series}
                                height={350} />

                        </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 px-[30px] py-[30px]">
                        <div className="lg:col-span-3">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                                <div className="flex items-center justify-between mb-6">
                                    <div className="flex items-center space-x-2">
                                        <FaCalendarCheck className="h-6 w-6 text-amber-500" />
                                        <h3 className="text-lg font-bold text-slate-800">예약 현황</h3>
                                    </div>
                                    <div className="text-sm text-slate-500">
                                        예약 <span className="font-semibold text-amber-500">{validReservations}건</span> /
                                        취소 <span className="font-semibold text-red-500 ml-1">{cancelledReservations}건</span>
                                    </div>
                                </div>
                                {reserved && reserved.length > 0 ? (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        {reserved.map((reserve, idx) => {
                                            return (
                                                <div
                                                    key={reserve.id || idx}
                                                    className={`flex flex-col p-4 rounded-xl shadow-sm border transition-all hover:shadow-md ${reserve.status === "approve"
                                                        ? "bg-gradient-to-r from-green-50 to-green-100 border-green-200"
                                                        : reserve.status === "cancel"
                                                            ? "bg-gradient-to-r from-red-50 to-red-100 border-red-200"
                                                            : "bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200"
                                                        }`}
                                                >
                                                    <div className="flex justify-between items-center mb-2">
                                                        <div className="flex items-center gap-x-4">
                                                            <span className="px-3 py-1 rounded-full text-xs font-medium bg-white shadow-sm border-2 border-white">
                                                                {selectedMM + "." + selectedDD + " " + reserve.time}
                                                            </span>
                                                            <span className={`font-bold ${reserve.status === "approve"
                                                                ? "text-green-600"
                                                                : reserve.status === "cancel"
                                                                    ? "text-red-600"
                                                                    : "text-blue-600"
                                                                }`}>
                                                                {reserve.status === "approve"
                                                                    ? "승인"
                                                                    : reserve.status === "cancel"
                                                                        ? "취소"
                                                                        : "승인 대기"
                                                                }
                                                            </span>
                                                        </div>
                                                        <span className="font-bold text-slate-700">{reserve.count}명</span>
                                                    </div>
                                                    <p className="text-sm text-slate-600 mt-2">
                                                        <span className="font-medium">요청사항: </span>
                                                        {reserve.comment || "없음"}
                                                    </p>
                                                </div>
                                            );
                                        })}
                                    </div>
                                ) : (
                                    <div className="text-center py-6">
                                        <p className="text-slate-500">예약 정보가 없습니다</p>
                                    </div>
                                )}
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <div className="flex items-center space-x-2 mb-6">
                                    <FaEye className="h-6 w-6 text-purple-500" />
                                    <h3 className="text-lg font-bold text-slate-800">페이지 조회수 통계</h3>
                                </div>
                                <Chart
                                    options={options}
                                    series={series}
                                    type="line"
                                    height={300}
                                />
                            </div>
                        </div>

                        <div className="lg:col-span-2 space-y-6">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                {todayBestOrder()}
                            </div>

                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                {proPlanCard()}
                            </div>
                        </div>
                    </div>

                </div>
            }
        </div>
    );

    function proPlanCard() {
        return (
            <>
                <div className="flex items-center space-x-2 mb-6">
                    <FaStar className="h-6 w-6 text-amber-500" />
                    <h3 className="text-lg font-bold text-slate-800">Pro 플랜</h3>
                </div>

                <div className={`p-5 rounded-xl ${userData.isPro ? 'bg-gradient-to-r from-blue-50 to-indigo-50' : 'bg-gradient-to-r from-slate-50 to-gray-100'}`}>
                    {userData.isPro ? (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="p-2 rounded-full bg-blue-100">
                                        <svg className="h-6 w-6 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="text-sm font-medium text-gray-900">Pro 이용중</h4>
                                        <p className="text-xs text-gray-500">{userData.proDuration}까지</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 mb-4">현재 Pro 플랜의 모든 기능을 이용하실 수 있습니다.</p>
                            <button className="w-full px-4 py-2 text-white font-medium bg-red-500 hover:bg-red-600 rounded-lg shadow-sm transition-colors">
                                구독 취소
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center">
                                    <div className="p-2 rounded-full bg-slate-100">
                                        <svg className="h-6 w-6 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="text-sm font-medium text-gray-900">무료 플랜 이용중</h4>
                                        <p className="text-xs text-gray-500">기능 제한이 있습니다</p>
                                    </div>
                                </div>
                            </div>
                            <p className="text-sm text-slate-600 mb-4">지금 Pro 플랜으로 업그레이드하고 모든 기능을 이용해보세요.</p>
                            <button className="w-full px-4 py-2 text-white font-medium bg-green-500 hover:bg-green-600 rounded-lg shadow-sm transition-colors">
                                플랜 업그레이드
                            </button>
                        </>
                    )}
                </div>
            </>
        );
    }

    function todayBestOrder() {
        const labels = Object.keys(bestOrder);
        const series = Object.values(bestOrder);

        const options = {
            chart: {
                type: 'pie',
                fontFamily: 'Pretendard, sans-serif',
                background: 'transparent',
                animations: {
                    enabled: true,
                    easing: 'easeinout',
                    speed: 800
                }
            },
            labels: labels,
            colors: ['#3b82f6', '#10b981', '#f59e0b', '#6366f1', '#ec4899'],
            legend: {
                position: 'bottom',
                fontSize: '14px',
                fontFamily: 'Pretendard, sans-serif',
                markers: {
                    width: 12,
                    height: 12,
                    radius: 6
                }
            },
            stroke: {
                width: 0
            },
            tooltip: {
                style: {
                    fontSize: '14px'
                }
            },
            plotOptions: {
                pie: {
                    donut: {
                        size: '0%'
                    },
                    expandOnClick: true
                }
            }
        };

        return (
            <>
                <div className="flex items-center space-x-2 mb-6">
                    <FaChartPie className="h-6 w-6 text-blue-500" />
                    <h3 className="text-lg font-bold text-slate-800">오늘의 인기메뉴 Top5</h3>
                </div>

                {Object.keys(bestOrder).length === 0 ? (
                    <div className="text-center py-6">
                        <p className="text-slate-500">주문 정보가 없습니다</p>
                    </div>
                ) : (
                    <>
                        <div className="mb-4">
                            {Object.entries(bestOrder).map(([name, count], idx) => {
                                if (idx < 5) {
                                    return (
                                        <div key={name + idx} className="flex justify-between items-center py-2 border-b border-slate-100">
                                            <div className="flex items-center">
                                                <div className={`w-6 h-6 rounded-full flex items-center justify-center mr-3 ${idx === 0 ? 'bg-blue-100 text-blue-600' :
                                                    idx === 1 ? 'bg-green-100 text-green-600' :
                                                        idx === 2 ? 'bg-amber-100 text-amber-600' :
                                                            'bg-slate-100 text-slate-600'
                                                    }`}>
                                                    <span className="text-sm font-semibold">{idx + 1}</span>
                                                </div>
                                                <span className="font-medium text-slate-700">{name}</span>
                                            </div>
                                            <span className="bg-slate-100 px-2 py-1 rounded-full text-xs font-semibold text-slate-600">{count}회</span>
                                        </div>
                                    );
                                }
                                return null;
                            })}
                        </div>
                        <div className="flex justify-center mt-4">
                            <Chart
                                options={options}
                                series={series}
                                type="pie"
                                height={260}
                                width={320}
                            />
                        </div>
                    </>
                )}
            </>
        );
    }
}
