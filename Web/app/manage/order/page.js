'use client'

import Manage from "../page";
import { supabaseClient } from '@/lib/supabase';
import React, { useEffect, useState, useRef } from 'react';
import { FaShoppingCart, FaCalendarAlt, FaCheck, FaTimes, FaTable, FaClock, FaMoneyBillWave } from "react-icons/fa";
import CountUp from "react-countup";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
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

export default function ManageOrder() {
    const [isLoading, setIsLoading] = useState(true);
    const [orders, setOrders] = useState([]);
    const [userData, setUserData] = useState({
        b_id: 0,
    });
    const [calendarOpen, setCalendarOpen] = useState(false);

    const today = new Date();
    const [selectedDay, setSelectedDay] = useState(today);
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');

    const [formattedDate, setFormattedDate] = useState(`${yyyy}-${mm}-${dd}`);
    const intervalIdRef = useRef(null);

    // 날짜 선택 핸들러
    const handleDaySelect = async (day) => {
        if (day) {
            setSelectedDay(day);
            const newFormattedDate = format(day, 'yyyy-MM-dd');
            setFormattedDate(newFormattedDate);
            setCalendarOpen(false);

            // 선택된 날짜로 데이터 불러오기
            const { data } = await supabaseClient.from('order_data')
                .select("*")
                .eq('b_id', userData.b_id)
                .like('time', `%${newFormattedDate}%`)
                .order("id", { ascending: false });

            setOrders(data);
        }
    };

    // 기존 코드는 유지
    useEffect(() => {
        // 기존 interval 정리 (항상 먼저 실행)
        if (intervalIdRef.current) {
            clearInterval(intervalIdRef.current);
            intervalIdRef.current = null;
        }

        const fetchData = async () => {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (!user) return;

            const { data: u_data } = await supabaseClient.from('profile_data').select(`*`).eq('id', user.id).single();
            setUserData({ b_id: u_data.b_id });
            const b_id = u_data.b_id;

            // 데이터 가져오기 (모든 날짜에 공통)
            const { data } = await supabaseClient.from('order_data')
                .select("*")
                .eq('b_id', b_id)
                .like('time', `%${formattedDate}%`)
                .order("id", { ascending: false });

            setOrders(data);

            // 오늘 날짜인 경우에만 interval 설정
            const todayStr = new Date().toISOString().slice(0, 10);
            if (formattedDate === todayStr) {
                let test1 = data;

                // interval 설정 전 기존 interval 다시 한번 확인해서 제거
                if (intervalIdRef.current) {
                    clearInterval(intervalIdRef.current);
                }

                intervalIdRef.current = setInterval(async () => {
                    const { data: newData } = await supabaseClient.from('order_data')
                        .select("*")
                        .eq('b_id', b_id)
                        .like('time', `%${formattedDate}%`)
                        .order("id", { ascending: false });

                    setOrders(newData);
                    const test2 = newData;
                    setIsLoading(false);

                    if ((test1?.length ?? 0) !== (test2?.length ?? 0)) {
                        beep();
                        test1 = test2;
                    }
                }, 1000);
            } else {
                setIsLoading(false);
            }
        };

        fetchData();

        // 컴포넌트 언마운트나 dependencies 변경 시 정리
        return () => {
            if (intervalIdRef.current) {
                clearInterval(intervalIdRef.current);
                intervalIdRef.current = null;
            }
        };
    }, [formattedDate]);

    // 기존 함수들 유지
    function beep() {
        var snd = new Audio("data:audio/wav;base64,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qJrx4KOQjahZxWbcZgztj2c49nKmkId44S71j0c8eV9yDK6uPRzx5X18eDvjvQ6yKo9ZSS6l//8elePK/Lf//IInrOF/FvDoADYAGBMGb7FtErm5MXMlmPAJQVgWta7Zx2go+8xJ0UiCb8LHHdftWyLJE0QIAIsI+UbXu67dZMjmgDGCGl1H+vpF4NSDckSIkk7Vd+sxEhBQMRU8j/12UIRhzSaUdQ+rQU5kGeFxm+hb1oh6pWWmv3uvmReDl0UnvtapVaIzo1jZbf/pD6ElLqSX+rUmOQNpJFa/r+sa4e/pBlAABoAAAAA3CUgShLdGIxsY7AUABPRrgCABdDuQ5GC7DqPQCgbbJUAoRSUj+NIEig0YfyWUho1VBBBA//uQZB4ABZx5zfMakeAAAAmwAAAAF5F3P0w9GtAAACfAAAAAwLhMDmAYWMgVEG1U0FIGCBgXBXAtfMH10000EEEEEECUBYln03TTTdNBDZopopYvrTTdNa325mImNg3TTPV9q3pmY0xoO6bv3r00y+IDGid/9aaaZTGMuj9mpu9Mpio1dXrr5HERTZSmqU36A3CumzN/9Robv/Xx4v9ijkSRSNLQhAWumap82WRSBUqXStV/YcS+XVLnSS+WLDroqArFkMEsAS+eWmrUzrO0oEmE40RlMZ5+ODIkAyKAGUwZ3mVKmcamcJnMW26MRPgUw6j+LkhyHGVGYjSUUKNpuJUQoOIAyDvEyG8S5yfK6dhZc0Tx1KI/gviKL6qvvFs1+bWtaz58uUNnryq6kt5RzOCkPWlVqVX2a/EEBUdU1KrXLf40GoiiFXK///qpoiDXrOgqDR38JB0bw7SoL+ZB9o1RCkQjQ2CBYZKd/+VJxZRRZlqSkKiws0WFxUyCwsKiMy7hUVFhIaCrNQsKkTIsLivwKKigsj8XYlwt/WKi2N4d//uQRCSAAjURNIHpMZBGYiaQPSYyAAABLAAAAAAAACWAAAAApUF/Mg+0aohSIRobBAsMlO//Kk4soosy1JSFRYWaLC4qZBYWFRGZdwqKiwkNBVmoWFSJkWFxX4FFRQWR+LsS4W/rFRb/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////VEFHAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAU291bmRib3kuZGUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAMjAwNGh0dHA6Ly93d3cuc291bmRib3kuZGUAAAAAAAAAACU=");

        snd.play();
        snd.addEventListener("ended", function () {
            snd.currentTime = 0;
            snd.play();
            snd.addEventListener("ended", function () {
                snd.currentTime = 0;
                snd.play();
            }, { once: true });
        }, { once: true });
    }

    async function checkOrder(id) {
        console.log(id);
        const { error } = await supabaseClient
            .from('order_data')
            .update({ status: 'check' })
            .eq('id', parseInt(id))
        setOrders([]);
        const { data } = await supabaseClient.from('order_data').select("*").eq('b_id', userData.b_id).like('time', `%${formattedDate}%`).order("id", { ascending: false });
        setOrders(data)
    }

    async function cancelOrder(id) {
        console.log(id);
        const { error } = await supabaseClient
            .from('order_data')
            .update({ status: 'cancel' })
            .eq('id', id)
        setOrders([]);
        const { data } = await supabaseClient.from('order_data').select("*").eq('b_id', userData.b_id).like('time', `%${formattedDate}%`).order("id", { ascending: false });
        setOrders(data)
    }

    // 주문 상태별 개수
    const pendingOrders = orders ? orders.filter(order => order.status === "order").length : 0;
    const confirmedOrders = orders ? orders.filter(order => order.status === "check").length : 0;
    const cancelledOrders = orders ? orders.filter(order => order.status === "cancel").length : 0;

    return (
        <Manage>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                {isLoading ? (
                    <div className="flex flex-row mx-auto my-20 md:-my-20 h-screen justify-center md:items-center">
                        <div className="w-40 h-40 rounded-full animate-spin 
                                border-2 border-solid border-blue-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="container mx-auto">
                        <div className="flex justify-between items-center px-[30px] pt-[30px] mb-4">
                            <h1 className="text-2xl font-bold text-slate-800">주문 관리</h1>

                            {/* DayPicker로 변경된 날짜 선택기 */}
                            <div className="relative">
                                <button
                                    onClick={() => setCalendarOpen(!calendarOpen)}
                                    className="flex items-center px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
                                >
                                    <FaCalendarAlt className="h-4 w-4 text-slate-500 mr-2" />
                                    <span className="text-sm font-medium">{format(selectedDay, 'yyyy년 MM월 dd일')}</span>
                                </button>

                                {calendarOpen && (
                                    <div className="absolute right-0 mt-2 z-10 bg-white rounded-xl shadow-xl border border-slate-200 p-4 w-[320px] animate-fadeIn">
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
                                                    borderRadius: '2.5rem',
                                                },
                                                today: {
                                                    color: '#3b82f6',
                                                    fontWeight: 'bold'
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-[30px] mb-6">
                            {/* 주문 대기 카드 */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px] flex flex-col justify-between">
                                <div className="p-6 flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-sm font-semibold text-slate-500">주문 대기</h2>
                                        <div className="p-2 bg-blue-500/10 rounded-full">
                                            <FaShoppingCart className="h-5 w-5 text-blue-500" />
                                        </div>
                                    </div>
                                    <div className="flex items-baseline">
                                        <CountUp
                                            duration={2}
                                            end={pendingOrders}
                                            className="text-3xl font-bold text-slate-800"
                                        />
                                        <span className="ml-1 text-lg font-medium text-slate-800">건</span>
                                    </div>
                                </div>
                                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 w-full"></div>
                            </div>

                            {/* 주문 확인 카드 */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px] flex flex-col justify-between">
                                <div className="p-6 flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-sm font-semibold text-slate-500">주문 확인</h2>
                                        <div className="p-2 bg-green-500/10 rounded-full">
                                            <FaCheck className="h-5 w-5 text-green-500" />
                                        </div>
                                    </div>
                                    <div className="flex items-baseline">
                                        <CountUp
                                            duration={2}
                                            end={confirmedOrders}
                                            className="text-3xl font-bold text-slate-800"
                                        />
                                        <span className="ml-1 text-lg font-medium text-slate-800">건</span>
                                    </div>
                                </div>
                                <div className="h-1 bg-gradient-to-r from-green-500 to-green-600 w-full"></div>
                            </div>

                            {/* 주문 취소 카드 */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px] flex flex-col justify-between">
                                <div className="p-6 flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-sm font-semibold text-slate-500">주문 취소</h2>
                                        <div className="p-2 bg-red-500/10 rounded-full">
                                            <FaTimes className="h-5 w-5 text-red-500" />
                                        </div>
                                    </div>
                                    <div className="flex items-baseline">
                                        <CountUp
                                            duration={2}
                                            end={cancelledOrders}
                                            className="text-3xl font-bold text-slate-800"
                                        />
                                        <span className="ml-1 text-lg font-medium text-slate-800">건</span>
                                    </div>
                                </div>
                                <div className="h-1 bg-gradient-to-r from-red-500 to-red-600 w-full"></div>
                            </div>
                        </div>

                        <div className="px-[30px] pb-[30px]">
                            {(orders === null || orders.length === 0) && (
                                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 text-center">
                                    <FaShoppingCart className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                                    <p className="text-xl font-semibold text-slate-500 mb-4">주문 데이터가 없습니다</p>
                                    <p className="text-slate-400">선택한 날짜에 주문 데이터가 없습니다. 다른 날짜를 선택하거나 나중에 다시 확인해주세요.</p>
                                </div>
                            )}

                            {orders && orders.length !== 0 && (
                                <>
                                    {/* 1. 주문 대기(order) 섹션 */}
                                    {orders.filter(order => order.status === "order").length > 0 && (
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                                            <div className="flex items-center space-x-2 mb-6">
                                                <FaShoppingCart className="h-6 w-6 text-blue-500" />
                                                <h3 className="text-lg font-bold text-slate-800">주문 대기</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                {orders
                                                    .filter(order => order.status === "order")
                                                    .map((order) => {
                                                        var tmpName = order.name.split(",");
                                                        var tmpPrice = order.price.split(",");
                                                        var tmpCount = order.count.split(",");
                                                        var totalAmount = 0;
                                                        for (let i = 0; i < tmpPrice.length - 1; i++) {
                                                            totalAmount += parseInt(tmpPrice[i]) * parseInt(tmpCount[i]);
                                                        }
                                                        return (
                                                            <div key={order.id} className="flex flex-col justify-between p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                                                <div>
                                                                    <div className="flex justify-between items-center mb-3">
                                                                        <div className="flex items-center space-x-2">
                                                                            <span className="p-2 font-bold text-slate-800">{order.table_no}번 테이블</span>
                                                                        </div>
                                                                        <div className="flex items-center text-sm text-slate-500">
                                                                            <FaClock className="mr-1 h-3 w-3" />
                                                                            <span>{order.time.substring(5, 16)}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="bg-slate-50 rounded-lg p-3 mb-3">
                                                                        {tmpName.map((menuName, index) => menuName.length != 0 && (
                                                                            <div key={index} className="flex justify-between py-1 border-b border-slate-100 last:border-0">
                                                                                <p className="text-slate-700">{menuName}</p>
                                                                                <p className="font-semibold">{tmpCount[index]}개</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                <div className="mt-2">
                                                                    <div className="flex justify-between mb-3">
                                                                        <div className="flex items-center">
                                                                            <div className="px-2 py-1 bg-blue-100 text-blue-600 text-xs font-medium rounded-full">대기중</div>
                                                                        </div>
                                                                        <div className="flex items-center font-bold text-slate-800">
                                                                            <FaMoneyBillWave className="h-4 w-4 text-green-500 mr-1" />
                                                                            {totalAmount.toLocaleString()}원
                                                                        </div>
                                                                    </div>
                                                                    <div className="grid grid-cols-2 gap-2">
                                                                        <button
                                                                            onClick={() => checkOrder(order.id)}
                                                                            className="px-4 py-2.5 bg-green-100 text-green-700 font-medium rounded-lg hover:bg-green-200 flex justify-center items-center transition-colors"
                                                                        >
                                                                            <FaCheck className="mr-1 h-4 w-4" />
                                                                            확인
                                                                        </button>
                                                                        <button
                                                                            onClick={() => cancelOrder(order.id)}
                                                                            className="px-4 py-2.5 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 flex justify-center items-center transition-colors"
                                                                        >
                                                                            <FaTimes className="mr-1 h-4 w-4" />
                                                                            취소
                                                                        </button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    )}

                                    {/* 2. 주문 확인(check) 섹션 */}
                                    {orders.filter(order => order.status === "check").length > 0 && (
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                                            <div className="flex items-center space-x-2 mb-6">
                                                <FaCheck className="h-6 w-6 text-green-500" />
                                                <h3 className="text-lg font-bold text-slate-800">주문 확인</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                {orders
                                                    .filter(order => order.status === "check")
                                                    .map((order) => {
                                                        var tmpName = order.name.split(",");
                                                        var tmpPrice = order.price.split(",");
                                                        var tmpCount = order.count.split(",");
                                                        var totalAmount = 0;
                                                        for (let i = 0; i < tmpPrice.length - 1; i++) {
                                                            totalAmount += parseInt(tmpPrice[i]) * parseInt(tmpCount[i]);
                                                        }
                                                        return (
                                                            <div key={order.id} className="flex flex-col justify-between p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                                                <div>
                                                                    <div className="flex justify-between items-center mb-3">
                                                                        <div className="flex items-center space-x-2">
                                                                            <span className="p-2 font-bold text-slate-800">{order.table_no}번 테이블</span>
                                                                        </div>
                                                                        <div className="flex items-center text-sm text-slate-500">
                                                                            <FaClock className="mr-1 h-3 w-3" />
                                                                            <span>{order.time.substring(5, 16)}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="bg-slate-50 rounded-lg p-3 mb-3">
                                                                        {tmpName.map((menuName, index) => menuName.length != 0 && (
                                                                            <div key={index} className="flex justify-between py-1 border-b border-slate-100 last:border-0">
                                                                                <p className="text-slate-700">{menuName}</p>
                                                                                <p className="font-semibold">{tmpCount[index]}개</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                <div className="mt-2">
                                                                    <div className="flex justify-between mb-3">
                                                                        <div className="flex items-center">
                                                                            <div className="px-2 py-1 bg-green-100 text-green-600 text-xs font-medium rounded-full">확인완료</div>
                                                                        </div>
                                                                        <div className="flex items-center font-bold text-slate-800">
                                                                            <FaMoneyBillWave className="h-4 w-4 text-green-500 mr-1" />
                                                                            {totalAmount.toLocaleString()}원
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        className="w-full px-4 py-2.5 bg-slate-100 text-slate-500 font-medium rounded-lg cursor-not-allowed opacity-60"
                                                                        disabled
                                                                    >
                                                                        처리 완료
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    )}

                                    {/* 3. 주문 취소(cancel) 섹션 */}
                                    {orders.filter(order => order.status === "cancel").length > 0 && (
                                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                            <div className="flex items-center space-x-2 mb-6">
                                                <FaTimes className="h-6 w-6 text-red-500" />
                                                <h3 className="text-lg font-bold text-slate-800">주문 취소</h3>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                                                {orders
                                                    .filter(order => order.status === "cancel")
                                                    .map((order) => {
                                                        var tmpName = order.name.split(",");
                                                        var tmpPrice = order.price.split(",");
                                                        var tmpCount = order.count.split(",");
                                                        var totalAmount = 0;
                                                        for (let i = 0; i < tmpPrice.length - 1; i++) {
                                                            totalAmount += parseInt(tmpPrice[i]) * parseInt(tmpCount[i]);
                                                        }
                                                        return (
                                                            <div key={order.id} className="flex flex-col justify-between p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                                                <div>
                                                                    <div className="flex justify-between items-center mb-3">
                                                                        <div className="flex items-center space-x-2">
                                                                            <span className="p-2 font-bold text-slate-800">{order.table_no}번 테이블</span>
                                                                        </div>
                                                                        <div className="flex items-center text-sm text-slate-500">
                                                                            <FaClock className="mr-1 h-3 w-3" />
                                                                            <span>{order.time.substring(5, 16)}</span>
                                                                        </div>
                                                                    </div>
                                                                    <div className="bg-slate-50 rounded-lg p-3 mb-3">
                                                                        {tmpName.map((menuName, index) => menuName.length != 0 && (
                                                                            <div key={index} className="flex justify-between py-1 border-b border-slate-100 last:border-0">
                                                                                <p className="text-slate-700">{menuName}</p>
                                                                                <p className="font-semibold">{tmpCount[index]}개</p>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                <div className="mt-2">
                                                                    <div className="flex justify-between mb-3">
                                                                        <div className="flex items-center">
                                                                            <div className="px-2 py-1 bg-red-100 text-red-600 text-xs font-medium rounded-full">주문취소</div>
                                                                        </div>
                                                                        <div className="flex items-center font-bold text-slate-800">
                                                                            <FaMoneyBillWave className="h-4 w-4 text-green-500 mr-1" />
                                                                            {totalAmount.toLocaleString()}원
                                                                        </div>
                                                                    </div>
                                                                    <button
                                                                        className="w-full px-4 py-2.5 bg-slate-100 text-slate-500 font-medium rounded-lg cursor-not-allowed opacity-60"
                                                                        disabled
                                                                    >
                                                                        취소됨
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Manage>
    );
}
