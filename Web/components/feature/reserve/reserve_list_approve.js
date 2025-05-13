import React from 'react';
import { FaUserFriends, FaComment, FaCalendarCheck, FaTimesCircle } from "react-icons/fa";

export default function ReserveListApprove({ reservations, onCancel, selectedMM, selectedDD }) {
    return (
        <>
            {reservations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reservations.map((reserve) => (
                        <div key={reserve.id} className="bg-white border border-green-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center gap-2">
                                    <div className="p-2 bg-green-100 rounded-lg">
                                        <FaCalendarCheck className="h-4 w-4 text-green-600" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-sm font-semibold text-slate-800">예약 #{reserve.id}</span>
                                        <span className="text-xs text-slate-500">{reserve.time}</span>
                                    </div>
                                </div>
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">승인됨</span>
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center text-sm">
                                    <FaUserFriends className="h-4 w-4 text-slate-400 mr-2" />
                                    <span className="text-slate-600">{reserve.count}명</span>
                                </div>
                                <div className="flex items-start text-sm">
                                    <FaComment className="h-4 w-4 text-slate-400 mr-2 mt-1" />
                                    <span className="text-slate-600 flex-1">{reserve.comment || "요청사항 없음"}</span>
                                </div>
                            </div>

                            <div className="mt-4">
                                <button
                                    onClick={() => onCancel(reserve.id)}
                                    className="w-full flex items-center justify-center py-2 px-4 bg-red-100 text-red-700 font-medium rounded-lg hover:bg-red-200 transition-colors"
                                >
                                    <FaTimesCircle className="h-4 w-4 mr-1" />
                                    취소하기
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl">
                    <FaCalendarCheck className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg mb-2">승인된 예약이 없습니다</p>
                    <p className="text-slate-400 text-sm">선택한 날짜에 승인된 예약이 없습니다</p>
                </div>
            )}
        </>
    );
}
