'use client'
import Chart from "react-apexcharts";
import React, { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase';
import { chartData, chartData2, chartData3 } from './chartData'; // 차트 데이터 임포트

export default function SalesDaily() {
    const [isLine, setIsLine] = useState(true);
    const [isLoading, setIsLoading] = useState(true);

    const [orders, setOrders] = useState({ orders: [], result: {}, cumulative: {}, orderByTime: {} });

    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0'); // getMonth()는 0부터 시작
    const dd = String(today.getDate()).padStart(2, '0');

    const [formattedDate, setFormattedDate] = useState(`${yyyy}-${mm}-${dd}`);

    const formattedCurrentTime = `${yyyy}-${mm}-${dd} ${String(today.getHours()).padStart(2, '0')}`;  // "yyyy-mm-dd hh"

    useEffect(() => {
        const fetchOrders = async () => {
            const { data: { user } } = await supabaseClient.auth.getUser()
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

                data.forEach(item => {
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

                setOrders({ orders: data, result: fullResult, cumulative, orderByTime: fullOrderByTime });
                setIsLoading(false);
            };
        }
        fetchOrders();
    }, [formattedDate]);



    // 날짜를 하루 더하는 함수
    const addOneDay = async () => {
        const date = new Date(formattedDate);
        date.setDate(date.getDate() + 1);
        setFormattedDate(date.toISOString().slice(0, 10));
    };

    // 날짜를 하루 빼는 함수
    const subtractOneDay = async () => {
        const date = new Date(formattedDate);
        date.setDate(date.getDate() - 1);
        setFormattedDate(date.toISOString().slice(0, 10));
    };

    return (
        <div className="flex flex-col" >
            <div className="flex w-full justify-center gap-x-6">
                <p className="font-bold text-xl" onClick={subtractOneDay}>&lt;</p>
                <p className="font-bold text-xl">{formattedDate}</p>
                {
                    formattedDate == `${yyyy}-${mm}-${dd}` ?
                        <p className="font-bold text-xl text-gray-300" >&gt;</p> :
                        <p className="font-bold text-xl" onClick={addOneDay}>&gt;</p>
                }

            </div>
            <button className="w-35 text-black border rounded" onClick={() => { setIsLine(!isLine); console.log(orders); }}>Line / Bar 전환</button>
            {isLoading ?
                <div className="flex flex-row mx-auto my-20 md:-my-20 h-screen justify-center md:items-center">
                    <div className="w-40 h-40 rounded-full animate-spin 
                        border-2 border-solid border-blue-500 border-t-transparent"></div>
                </div>
                :
                <div>
                    <div className="flex flex-wrap gap-x-20">
                        <div className="flex flex-col">
                            <Chart
                                key={isLine ? 'area' : 'bar'}
                                type={isLine ? "area" : "bar"}
                                options={chartData(formattedDate, orders).options}
                                series={chartData(formattedDate, orders).series}
                                width="400" />
                            <p>누적 매출</p>
                        </div>
                        <div className="flex flex-col">
                            <Chart
                                key={isLine ? 'line' : 'bar'}
                                type={isLine ? "line" : "bar"}
                                options={chartData2(formattedDate, orders).options}
                                series={chartData2(formattedDate, orders).series}
                                width="400" />
                            <p>시간대별 매출</p>
                        </div>
                        <div className="flex flex-col">
                            <Chart
                                key={isLine ? 'line' : 'bar'}
                                type={isLine ? "line" : "bar"}
                                options={chartData3(formattedDate, orders).options}
                                series={chartData3(formattedDate, orders).series}
                                width="400" />
                            <p>시간대별 주문</p>
                        </div>
                        {/* <div className="flex flex-col">
                            <Chart
                                key={isLine ? 'line' : 'bar'}
                                type={isLine ? "line" : "bar"}
                                options={chartData.options}
                                series={chartData.series}
                                width="400" />
                            <p>시간대별 주문</p>
                        </div> */}
                    </div>
                </div>}


        </div >
    )
}