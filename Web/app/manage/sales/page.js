'use client'

import dynamic from 'next/dynamic';
import Manage from "../page";
import React, { useState } from 'react';
import { FaChartLine, FaCalculator, FaChartBar } from "react-icons/fa";

const SalesDaily = dynamic(() => import('@/components/feature/sales/sales_daily'), { ssr: false });
const SalesCalc = dynamic(() => import('@/components/feature/sales/sales_calc'), { ssr: false });
const SalesAnalysis = dynamic(() => import('@/components/feature/sales/sales_analysis'), { ssr: false });

export default function ManageCalc() {
    const [openTab, setOpenTab] = useState(1);

    return (
        <Manage>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="container mx-auto">
                    <div className="flex justify-between items-center px-[30px] pt-[30px] mb-4">
                        <h1 className="text-2xl font-bold text-slate-800">매출 관리</h1>
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
                                <FaChartLine className={`h-4 w-4 ${openTab === 1 ? "text-white" : "text-blue-500"}`} />
                                <span>일별 매출</span>
                            </button>
                            <button
                                onClick={() => setOpenTab(2)}
                                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${openTab === 2
                                    ? "bg-green-500 text-white shadow-sm"
                                    : "text-slate-500 hover:bg-slate-100"
                                    }`}
                            >
                                <FaChartBar className={`h-4 w-4 ${openTab === 2 ? "text-white" : "text-green-500"}`} />
                                <span>매출 분석</span>
                                <span className="px-2 py-0.5 text-xs font-medium text-green-600 bg-green-100 rounded-full">Pro</span>
                            </button>
                            <button
                                onClick={() => setOpenTab(3)}
                                className={`flex-1 py-3 px-4 rounded-lg flex items-center justify-center gap-2 font-medium transition-all ${openTab === 3
                                    ? "bg-amber-500 text-white shadow-sm"
                                    : "text-slate-500 hover:bg-slate-100"
                                    }`}
                            >
                                <FaCalculator className={`h-4 w-4 ${openTab === 3 ? "text-white" : "text-amber-500"}`} />
                                <span>매출 계산기</span>
                            </button>
                        </div>
                    </div>

                    {/* 탭 컨텐츠 */}
                    <div className="px-[30px] pb-8">
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 w-full">
                            <div className="tab-content tab-space">
                                <div className={openTab === 1 ? "block" : "hidden"} id="link1">
                                    <SalesDaily key={openTab === 1 ? "sales-daily" : "sales-daily-hidden"} />
                                </div>
                                <div className={openTab === 2 ? "block" : "hidden"} id="link2">
                                    <SalesAnalysis />
                                </div>
                                <div className={openTab === 3 ? "block" : "hidden"} id="link3">
                                    <SalesCalc />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Manage>
    );
}
