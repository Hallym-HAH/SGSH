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

    const formattedDate = `${yyyy}-${mm}-${dd}`;

    const formattedCurrentTime = `${yyyy}-${mm}-${dd} ${String(today.getHours()).padStart(2, '0')}`;  // "yyyy-mm-dd hh"

    useEffect(() => {
        const fetchOrders = async () => {
            const { data } = await supabaseClient.from('order_data').select("*").eq('b_id', 1).like('time', `%${formattedDate}%`).order("id", { ascending: false });

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

            // 8시부터 20시까지 강제 세팅
            const fullResult = {};
            const fullOrderByTime = {};
            // 누적
            const cumulative = {};
            let runningTotal = 0;
            for (let hour = 8; hour <= 20; hour++) {
                const hourStr = String(hour).padStart(2, '0');
                const timeKey = `${formattedDate} ${hourStr}`;

                // 현재 시간이 해당 시간대보다 이전이거나 같은 경우만 누적 매출을 구하고, 그 외에는 0을 설정
                if (timeKey <= formattedCurrentTime) {
                    fullResult[timeKey] = result[timeKey] || 0;
                    fullOrderByTime[timeKey] = orderByTime[timeKey] || 0;
                    runningTotal += result[timeKey] || 0;
                    cumulative[timeKey] = runningTotal;
                } else {
                    fullResult[timeKey] = null;
                    fullOrderByTime[timeKey] = null;
                    cumulative[timeKey] = null; // 현재 시간 이후에는 누적 매출을 0으로 설정
                }
            }

            setOrders({ orders: data, result: fullResult, cumulative, orderByTime: fullOrderByTime });
            setIsLoading(false)

        }
        fetchOrders()
    }, [])


    return (
        <div className="flex flex-col" >
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
                                key={isLine ? 'line' : 'bar'}
                                type={isLine ? "line" : "bar"}
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