"use client"

import Manage from "../page";
import React, { useEffect, useState } from "react";
import { supabaseClient } from '@/lib/supabase';
import ReserveListStandBy from "@/components/feature/reserve/reserve_list_standby";
import ReserveListApprove from "@/components/feature/reserve/reserve_list_approve";
import ReserveListHistory from "@/components/feature/reserve/reserve_list_history";
import { FaCalendarCheck, FaCheckCircle, FaHourglassHalf, FaTimesCircle, FaHistory, FaCalendarAlt } from "react-icons/fa";
import { DayPicker } from "react-day-picker";
import { format } from "date-fns";
import { ko } from "date-fns/locale";
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

export default function ManageReserve() {
    const [openTab, setOpenTab] = useState(1);
    const [reservations, setReservations] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userData, setUserData] = useState({ b_id: 0 });
    const [calendarOpen, setCalendarOpen] = useState(false);

    // 날짜 설정
    const today = new Date();
    const [selectedDay, setSelectedDay] = useState(today);
    const formattedDate = format(selectedDay, 'yyyy-MM-dd');

    useEffect(() => {
        fetchReservations();
    }, [formattedDate]);

    const fetchReservations = async () => {
        setIsLoading(true);
        try {
            const { data: { user } } = await supabaseClient.auth.getUser();
            if (user) {
                const { data: u_data } = await supabaseClient.from('profile_data').select(`*`).eq('id', user.id).single();
                setUserData({ b_id: u_data.b_id });
                const b_id = u_data.b_id;

                // 해당 날짜의 모든 예약 데이터 가져오기
                const { data: reservationData } = await supabaseClient
                    .from('reserve_data')
                    .select(`*`)
                    .eq('b_id', b_id)
                    .eq('date', formattedDate)
                    .order("time", { ascending: true });

                setReservations(reservationData || []);
            }
        } catch (error) {
            console.error("예약 데이터 로딩 중 오류:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const approveReservation = async (id) => {
        try {
            await supabaseClient
                .from('reserve_data')
                .update({ status: 'approve' })
                .eq('id', id);

            // 해당 예약 아이템만 상태 업데이트
            setReservations(prev =>
                prev.map(item => item.id === id ? { ...item, status: 'approve' } : item)
            );
        } catch (error) {
            console.error("예약 승인 중 오류:", error);
        }
    };

    const cancelReservation = async (id) => {
        try {
            await supabaseClient
                .from('reserve_data')
                .update({ status: 'cancel' })
                .eq('id', id);

            // 해당 예약 아이템만 상태 업데이트
            setReservations(prev =>
                prev.map(item => item.id === id ? { ...item, status: 'cancel' } : item)
            );
        } catch (error) {
            console.error("예약 취소 중 오류:", error);
        }
    };

    // 날짜 변경 핸들러
    const handleDaySelect = (day) => {
        setSelectedDay(day);
        setCalendarOpen(false);
    };

    // 예약 상태별 필터링
    const standbyReservations = reservations.filter(r => r.status === "standby");
    const approvedReservations = reservations.filter(r => r.status === "approve");
    const allReservations = reservations;

    // 선택된 날짜에서 월과 일 추출
    const selectedMM = format(selectedDay, 'MM');
    const selectedDD = format(selectedDay, 'dd');

    return (
        <Manage>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                {isLoading ? (
                    <div className="flex flex-row mx-auto my-20 md:-my-20 h-screen justify-center md:items-center">
                        <div className="w-40 h-40 rounded-full animate-spin border-2 border-solid border-blue-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="container mx-auto">
                        <div className="flex justify-between items-center px-[30px] pt-[30px] mb-4">
                            <h1 className="text-2xl font-bold text-slate-800">예약 관리</h1>

                            {/* 달력 선택기 */}
                            <div className="relative">
                                <button
                                    onClick={() => setCalendarOpen(!calendarOpen)}
                                    className="flex items-center px-4 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 transition-colors"
                                >
                                    <FaCalendarAlt className="h-4 w-4 text-slate-500 mr-2" />
                                    <span className="text-sm font-medium">{format(selectedDay, 'yyyy년 MM월 dd일')}</span>
                                </button>

                                {calendarOpen && (
                                    <div className="absolute right-0 mt-2 z-10 bg-white rounded-lg shadow-lg border border-slate-200">
                                        <DayPicker
                                            mode="single"
                                            selected={selectedDay}
                                            onSelect={handleDaySelect}
                                            locale={ko}
                                            className="p-3"
                                            components={{
                                                Caption: CustomCaption  // 커스텀 Caption 적용
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
                                                }
                                            }}
                                        />
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* 예약 상태 요약 카드 */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-[30px] mb-6">
                            {/* 예약 대기 카드 */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px] flex flex-col justify-between">
                                <div className="p-6 flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-sm font-semibold text-slate-500">예약 대기</h2>
                                        <div className="p-2 bg-blue-500/10 rounded-full">
                                            <FaHourglassHalf className="h-5 w-5 text-blue-500" />
                                        </div>
                                    </div>
                                    <div className="flex items-baseline">
                                        <CountUp
                                            duration={2}
                                            end={standbyReservations.length}
                                            className="text-3xl font-bold text-slate-800"
                                        />
                                        <span className="ml-1 text-lg font-medium text-slate-800">건</span>
                                    </div>
                                </div>
                                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 w-full"></div>
                            </div>

                            {/* 예약 승인 카드 */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px] flex flex-col justify-between">
                                <div className="p-6 flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-sm font-semibold text-slate-500">예약 승인</h2>
                                        <div className="p-2 bg-green-500/10 rounded-full">
                                            <FaCheckCircle className="h-5 w-5 text-green-500" />
                                        </div>
                                    </div>
                                    <div className="flex items-baseline">
                                        <CountUp
                                            duration={2}
                                            end={approvedReservations.length}
                                            className="text-3xl font-bold text-slate-800"
                                        />
                                        <span className="ml-1 text-lg font-medium text-slate-800">건</span>
                                    </div>
                                </div>
                                <div className="h-1 bg-gradient-to-r from-green-500 to-green-600 w-full"></div>
                            </div>

                            {/* 예약 취소 카드 */}
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px] flex flex-col justify-between">
                                <div className="p-6 flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-sm font-semibold text-slate-500">예약 취소</h2>
                                        <div className="p-2 bg-red-500/10 rounded-full">
                                            <FaTimesCircle className="h-5 w-5 text-red-500" />
                                        </div>
                                    </div>
                                    <div className="flex items-baseline">
                                        <CountUp
                                            duration={2}
                                            end={reservations.filter(r => r.status === "cancel").length}
                                            className="text-3xl font-bold text-slate-800"
                                        />
                                        <span className="ml-1 text-lg font-medium text-slate-800">건</span>
                                    </div>
                                </div>
                                <div className="h-1 bg-gradient-to-r from-red-500 to-red-600 w-full"></div>
                            </div>
                        </div>

                        {/* 탭 네비게이션 */}
                        <div className="px-[30px] mb-6">
                            <div className="flex space-x-2 bg-white p-2 rounded-xl shadow-sm">
                                <button
                                    onClick={() => setOpenTab(1)}
                                    className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${openTab === 1
                                        ? "bg-blue-500 text-white shadow-sm"
                                        : "text-slate-500 hover:bg-slate-100"
                                        }`}
                                >
                                    <FaHourglassHalf className={`h-4 w-4 ${openTab === 1 ? "text-white" : "text-blue-500"}`} />
                                    <span>예약 대기</span>
                                    {standbyReservations.length > 0 && (
                                        <span className={`px-2 py-1 text-xs rounded-full ${openTab === 1 ? "bg-white text-blue-500" : "bg-blue-100 text-blue-700"}`}>
                                            {standbyReservations.length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setOpenTab(2)}
                                    className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${openTab === 2
                                        ? "bg-green-500 text-white shadow-sm"
                                        : "text-slate-500 hover:bg-slate-100"
                                        }`}
                                >
                                    <FaCheckCircle className={`h-4 w-4 ${openTab === 2 ? "text-white" : "text-green-500"}`} />
                                    <span>예약 승인</span>
                                    {approvedReservations.length > 0 && (
                                        <span className={`px-2 py-1 text-xs rounded-full ${openTab === 2 ? "bg-white text-green-500" : "bg-green-100 text-green-700"}`}>
                                            {approvedReservations.length}
                                        </span>
                                    )}
                                </button>
                                <button
                                    onClick={() => setOpenTab(3)}
                                    className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${openTab === 3
                                        ? "bg-slate-500 text-white shadow-sm"
                                        : "text-slate-500 hover:bg-slate-100"
                                        }`}
                                >
                                    <FaHistory className={`h-4 w-4 ${openTab === 3 ? "text-white" : "text-slate-500"}`} />
                                    <span>예약 기록</span>
                                </button>
                            </div>
                        </div>

                        {/* 탭 컨텐츠 */}
                        <div className="px-[30px] pb-8">
                            {openTab === 1 && (
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-2">
                                            <FaHourglassHalf className="h-6 w-6 text-blue-500" />
                                            <h3 className="text-lg font-bold text-slate-800">예약 대기 목록</h3>
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            <FaCalendarAlt className="inline mr-1" /> {format(selectedDay, 'yyyy년 MM월 dd일')}
                                        </div>
                                    </div>
                                    <ReserveListStandBy
                                        reservations={standbyReservations}
                                        onApprove={approveReservation}
                                        onCancel={cancelReservation}
                                        formattedDate={formattedDate}
                                        selectedMM={selectedMM}
                                        selectedDD={selectedDD}
                                    />
                                </div>
                            )}

                            {openTab === 2 && (
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-2">
                                            <FaCheckCircle className="h-6 w-6 text-green-500" />
                                            <h3 className="text-lg font-bold text-slate-800">승인된 예약</h3>
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            <FaCalendarAlt className="inline mr-1" /> {format(selectedDay, 'yyyy년 MM월 dd일')}
                                        </div>
                                    </div>
                                    <ReserveListApprove
                                        reservations={approvedReservations}
                                        onCancel={cancelReservation}
                                        selectedMM={selectedMM}
                                        selectedDD={selectedDD}
                                    />
                                </div>
                            )}

                            {openTab === 3 && (
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full">
                                    <div className="flex items-center justify-between mb-6">
                                        <div className="flex items-center space-x-2">
                                            <FaHistory className="h-6 w-6 text-slate-500" />
                                            <h3 className="text-lg font-bold text-slate-800">예약 기록</h3>
                                        </div>
                                        <div className="text-sm text-slate-500">
                                            <FaCalendarAlt className="inline mr-1" /> {format(selectedDay, 'yyyy년 MM월 dd일')}
                                        </div>
                                    </div>
                                    <ReserveListHistory
                                        reservations={allReservations}
                                        selectedMM={selectedMM}
                                        selectedDD={selectedDD}
                                    />
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </div>
        </Manage>
    );
}
