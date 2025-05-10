import ManageNavBar from "@/components/feature/manage_navbar";
import { supabaseClient } from "@/lib/supabase";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import Chart from "react-apexcharts";
import { dashboardChartData } from '@/components/feature/sales/chartData'; // 차트 데이터 임포트

import CountUp from "react-countup";

export default function ManageDashboard() {
    const [userData, setUserData] = useState({
        b_id: 0,
        proDuration: "",
        isPro: false
    });
    const [isLoading, setIsLoading] = useState(true);
    // const [orders, setOrders] = useState([]);
    const [orders, setOrders] = useState({ orders: [], result: {}, cumulative: {}, orderByTime: {} });
    const [totalAmount, setTotalAmount] = useState(0);
    const [reserved, setReserved] = useState([]);
    const [hits, setHits] = useState([]);
    const [todayHits, setTodayHits] = useState([]);

    const [bestOrder, setBestOrder] = useState({});


    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // getMonth()는 0부터 시작
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
                // console.log(b_id);

                // 일단 모든 매출 (나중에 취소 매출 제외)
                const { data: orders } = await supabaseClient.from('order_data').select("*").eq('b_id', b_id).like('time', `%${formattedDate}%`).order("id", { ascending: false });

                const result = {};
                const orderByTime = {};

                orders.forEach(item => {
                    const timeKey = item.time.slice(0, 13); // "yyyy-mm-dd hh"

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

                    // orderByTime 계산 (시간대별 객체 개수 카운팅)
                    if (orderByTime[timeKey]) {
                        orderByTime[timeKey] += 1;
                    } else {
                        orderByTime[timeKey] = 1;
                    }
                });

                // 오늘 날짜와 비교
                const todayStr = new Date().toISOString().slice(0, 10);
                const isBeforeToday = formattedDate < todayStr;

                // 현재 시간 구하기
                const now = new Date();
                const currentHour = now.getHours();

                // 8시부터 20시까지 강제 세팅
                const fullResult = {};
                const fullOrderByTime = {};
                const cumulative = {};
                let runningTotal = 0;
                for (let hour = 8; hour <= 20; hour++) {
                    const hourStr = String(hour).padStart(2, '0');
                    const timeKey = `${formattedDate} ${hourStr}`;

                    // 오늘 이전이면 전부, 오늘이면 현재 시간까지만
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

                // 취소 제외 예약 정보 (승인, 대기)
                const { data: reserveData } = await supabaseClient.from('reserve_data').select(`*`).eq('b_id', b_id).neq('status', "cancel").order("date", { ascending: true }).order("time", { ascending: true });
                setReserved(reserveData);
                // console.log(reserveData);

                const { data: hitsData } = await supabaseClient.from('business_hits').select(`*`).eq('b_id', b_id).order('date', { ascending: false }).limit(7);
                setHits(hitsData);
                console.log(hitsData);

                const { data: todayHitsData } = await supabaseClient.from('business_hits').select(`*`).eq('b_id', b_id).eq('date', formattedDate).maybeSingle();
                setTodayHits(todayHitsData);



                // 이름 출현 횟수를 저장할 객체 생성
                const nameCounter = {};
                // 각 주문을 순회
                orders.forEach(order => {
                    // 이름을 쉼표로 분리하고 빈 문자열 제거
                    const names = order.name.split(',').filter(name => name.trim() !== '');

                    // 각 이름의 출현 횟수 계산
                    names.forEach(name => {
                        if (nameCounter[name]) {
                            nameCounter[name]++;
                        } else {
                            nameCounter[name] = 1;
                        }
                    });
                });
                // 출현 빈도에 따라 내림차순 정렬
                const sortedEntries = Object.entries(nameCounter).sort((a, b) => b[1] - a[1]);
                // 정렬된 결과로 새 객체 생성
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
        chart: { id: "basic-bar", type: 'line', toolbar: { show: false }, zoom: { enabled: false, allowMouseWheelZoom: false }, },
        xaxis: { categories },
        yaxis: {
            max: maxHits,
            tickAmount: maxHits >= 5 ? 5 : maxHits,
            forceNiceScale: true,
            labels: {
                formatter: function (value) {
                    return Math.round(value); // 정수로 변환
                }
            }
        }
    };

    return (
        <div className="h-full bg-[#f5f6ff]">
            {isLoading ?
                <div className="flex flex-row mx-auto my-20 md:-my-20 h-screen justify-center md:items-center">
                    <div className="w-40 h-40 rounded-full animate-spin 
                            border-2 border-solid border-blue-500 border-t-transparent"></div>
                </div>
                :
                <div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-4 gap-[30px] px-[30px] py-[40px]">
                        <div className="flex flex-col p-[20px] h-[150px] bg-white rounded-xl">
                            <p className="text-xl">매출</p>
                            <CountUp duration={2} className="" end={totalAmount} suffix="원" />
                        </div>
                        <div className="flex flex-col p-[20px] h-[150px] bg-white rounded-xl">
                            <p className="text-xl">주문</p>
                            <CountUp duration={2} className="" end={orders.orders.length} suffix="건" />
                        </div>
                        <div className="flex flex-col p-[20px] h-[150px] bg-white rounded-xl">
                            <p className="text-xl">예약</p>
                            <CountUp duration={2} className="" end={reserved.length} suffix="건" />
                        </div>
                        <div className="flex flex-col p-[20px] h-[150px] bg-white rounded-xl">
                            <p className="text-xl">조회수</p>
                            <CountUp duration={2} className="" end={todayHits ? todayHits.hits : 0} suffix="회" />
                        </div>
                    </div>

                    <div className="flex px-[30px]">
                        <div className="w-full p-[20px] bg-white rounded-xl ">
                            <div className="flex justify-between">
                                <p className="text-xl">누적 매출</p>
                                <p>{formattedDate}</p>
                            </div>
                            <Chart
                                className="w-[100%] pr-4"
                                key={'area'}
                                type={'area'}
                                options={dashboardChartData(formattedDate, orders).options}
                                series={dashboardChartData(formattedDate, orders).series}
                                height={350} />
                        </div>
                    </div>

                    <div className="flex px-[30px] py-[40px] gap-[30px]">
                        <div className="flex flex-col w-full gap-y-[30px]">

                            <div className="w-full p-[20px] bg-white rounded-xl">
                                <p className="mb-4 text-xl">예약 현황</p>
                                <div className="grid grid-cols-1 2xl:grid-cols-2 gap-2">
                                    {console.log()}
                                    {reserved.map((reserve, idx) => {
                                        if (reserve.status != "cancel")
                                            return (
                                                <div key={reserve + idx} className={`flex flex-col py-2 justify-center rounded-xl text-white ${reserve.status == "approve" ? "bg-[#00e396]" : "bg-[#2e9de4]"}`}>
                                                    <div className="flex justify-between px-4">
                                                        <div className="flex gap-x-4">
                                                            <p>{mm + "." + dd + " " + reserve.time}</p>
                                                            <p className="font-bold">{reserve.status == "approve" ? "승인" : "승인 대기"}</p>
                                                        </div>
                                                        <p>{reserve.count}명</p>
                                                    </div>

                                                    <p className="px-4">요청사항: {reserve.comment}</p>
                                                </div>
                                            );
                                    })}

                                </div>
                            </div>

                            <div className="w-full p-[20px] bg-white rounded-xl">
                                <p className="mb-4 text-xl">조회수</p>
                                <Chart
                                    options={options}
                                    series={series}
                                    type="line" />
                            </div>

                            <div className="flex flex-col w-full gap-y-[30px] block lg:hidden">
                                {todayBestOrder()}

                                {proPlanCard()}
                            </div>
                        </div>


                        <div className="w-full gap-y-[30px] hidden lg:flex lg:flex-col">
                            {todayBestOrder()}
                            {proPlanCard()}
                        </div>


                    </div>
                </div>
            }
        </div>
    )

    function proPlanCard() {
        return <div className="w-full p-[20px] bg-white rounded-xl">
            <div className="flex flex-start gap-x-4 mb-4 items-center">
                <p className="text-xl">Pro 플랜</p>
                <p>{userData.isPro && "~ " + userData.proDuration}</p>
            </div>
            {
                userData.isPro ?
                    <div className="flex justify-between items-center">
                        <p>현재 Pro 플랜을 사용 중입니다.</p>
                        <button className="px-4 py-2 text-white font-bold bg-[#dc3545] hover:bg-[#bb2d3b] rounded-xl">취소</button>
                    </div>
                    :
                    <div className="flex justify-between items-center">
                        <p>지금 Pro 플랜을 신청하세요.</p>
                        <button className="px-4 py-2 text-white font-bold bg-[#198754] hover:bg-[#157347] rounded-xl">신청</button>
                    </div>
            }

        </div>;
    }

    function todayBestOrder() {

        const labels = Object.keys(bestOrder);
        const series = Object.values(bestOrder);

        const options = {
            chart: {
                type: 'pie'
            },
            labels: labels,
            legend: {
                position: 'bottom'
            },
        };

        return <div className="w-full p-[20px] bg-white rounded-xl">
            <p className="mb-4 text-xl">오늘의 인기메뉴 Top5</p>
            {Object.entries(bestOrder).map(([name, count], idx) => {
                if (idx < 5) {
                    return (
                        <div key={name + idx} className="flex justify-between mt-2">
                            <p>{(idx + 1)}. {name}</p>
                            <p>{count}회</p>
                        </div>
                    );
                }
            })}

            {
                Object.keys(bestOrder).length === 0 && bestOrder.constructor === Object ? <p>주문 정보가 없습니다</p> :
                    <div className="flex justify-center">
                        <Chart
                            options={options}
                            series={series}
                            type="pie"
                            width="400"
                        />
                    </div>
            }

        </div>;
    }
}
