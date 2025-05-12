import React from 'react';
import { FaUserFriends, FaComment, FaCalendarCheck, FaHistory, FaCheckCircle, FaTimesCircle } from "react-icons/fa";

export default function ReserveListHistory({ reservations, selectedMM, selectedDD }) {
    return (
        <>
            {reservations.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {reservations.map((reserve) => {
                        const statusColor =
                            reserve.status === "approve" ? "green" :
                                reserve.status === "cancel" ? "red" : "blue";

                        const statusText =
                            reserve.status === "approve" ? "승인됨" :
                                reserve.status === "cancel" ? "취소됨" : "대기중";

                        const StatusIcon =
                            reserve.status === "approve" ? FaCheckCircle :
                                reserve.status === "cancel" ? FaTimesCircle : FaCalendarCheck;

                        return (
                            <div
                                key={reserve.id}
                                className={`bg-white border border-${statusColor}-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-all`}
                            >
                                <div className="flex items-center justify-between mb-4">
                                    <div className="flex items-center gap-2">
                                        <div className={`p-2 bg-${statusColor}-100 rounded-lg`}>
                                            <StatusIcon className={`h-4 w-4 text-${statusColor}-600`} />
                                        </div>
                                        <div className="flex flex-col">
                                            <span className="text-sm font-semibold text-slate-800">예약 #{reserve.id}</span>
                                            <span className="text-xs text-slate-500">{reserve.time}</span>
                                        </div>
                                    </div>
                                    <span className={`px-2 py-1 bg-${statusColor}-100 text-${statusColor}-700 text-xs font-medium rounded-full`}>
                                        {statusText}
                                    </span>
                                </div>

                                <div className="space-y-2">
                                    <div className="flex items-center text-sm">
                                        <FaUserFriends className="h-4 w-4 text-slate-400 mr-2" />
                                        <span className="text-slate-600">{reserve.count}명</span>
                                    </div>
                                    <div className="flex items-start text-sm">
                                        <FaComment className="h-4 w-4 text-slate-400 mr-2 mt-1" />
                                        <span className="text-slate-600 flex-1">{reserve.comment || "요청사항 없음"}</span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            ) : (
                <div className="text-center py-12 bg-slate-50 rounded-xl">
                    <FaHistory className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                    <p className="text-slate-500 text-lg mb-2">예약 기록이 없습니다</p>
                    <p className="text-slate-400 text-sm">선택한 날짜에 예약 기록이 없습니다</p>
                </div>
            )}
        </>
    );
}
