'use client'
import React, { useState } from 'react';
import { FaCalculator, FaStore, FaMoneyBillWave, FaBuilding, FaWrench, FaUsers, FaCreditCard, FaQuestion, FaInfoCircle } from "react-icons/fa";

export default function SalesCalc() {
    const [calcDataC, setCalcDataC] = useState({
        매출: "17,000,000",
        원가: "6,000,000",
        임대료: "2,500,000",
        관리비: "510,000",
        급여비: "2,800,000",
        수수료: "400,000",
    });

    const [calcData, setCalcData] = useState({
        매출: 17000000,
        원가: 6000000,
        임대료: 2500000,
        관리비: 510000,
        급여비: 2800000,
        수수료: 400000,
    });

    const handleInputChange = (e) => {
        const value = e.target.value;
        const onlyNums = value.replace(/[^0-9]/g, '');
        const withCommas = onlyNums.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
        setCalcDataC({ ...calcDataC, [e.target.name]: withCommas });
        setCalcData({ ...calcData, [e.target.name]: parseInt(onlyNums) || 0 });
    };

    // 계산된 수익과 수익률
    const calculatedProfit = calcData.매출 - calcData.원가 - calcData.임대료 - calcData.관리비 - calcData.급여비 - calcData.수수료;
    // 0으로 나누기 오류 방지를 위한 처리
    const profitMargin = calcData.매출 > 0 ? Math.round((calculatedProfit / calcData.매출) * 100) : 0;
    const isPositiveProfit = calculatedProfit >= 0;

    // 비용 분석 - 0으로 나누기 오류 방지 처리
    const costBreakdown = [
        {
            name: '원가',
            value: calcData.원가,
            percent: calcData.매출 > 0 ? Math.round((calcData.원가 / calcData.매출) * 100) : 0
        },
        {
            name: '임대료',
            value: calcData.임대료,
            percent: calcData.매출 > 0 ? Math.round((calcData.임대료 / calcData.매출) * 100) : 0
        },
        {
            name: '관리비',
            value: calcData.관리비,
            percent: calcData.매출 > 0 ? Math.round((calcData.관리비 / calcData.매출) * 100) : 0
        },
        {
            name: '급여비',
            value: calcData.급여비,
            percent: calcData.매출 > 0 ? Math.round((calcData.급여비 / calcData.매출) * 100) : 0
        },
        {
            name: '수수료',
            value: calcData.수수료,
            percent: calcData.매출 > 0 ? Math.round((calcData.수수료 / calcData.매출) * 100) : 0
        },
    ];

    return (
        <div className="bg-white rounded-xl shadow-sm">
            <div className="p-6 pb-0">
                <div className="flex items-center space-x-2 mb-6">
                    <FaCalculator className="h-5 w-5 text-blue-600" />
                    <h2 className="text-xl font-bold text-slate-800">매출 손익 계산기</h2>
                </div>
            </div>

            <div className="p-6 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* 입력 섹션 */}
                <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                        {/* 매출 입력 필드 */}
                        <div>
                            <label className="flex items-center text-slate-700 mb-2 font-medium">
                                <FaMoneyBillWave className="mr-2 text-green-600" />
                                예상 월 매출
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="\d*"
                                value={calcDataC.매출}
                                onChange={handleInputChange}
                                name="매출"
                                className="text-right text-lg border border-slate-300 shadow-sm p-3 w-full h-14 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>

                        {/* 원가 입력 필드 */}
                        <div>
                            <label className="flex items-center text-slate-700 mb-2 font-medium">
                                <FaStore className="mr-2 text-blue-600" />
                                원가
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="\d*"
                                value={calcDataC.원가}
                                onChange={handleInputChange}
                                name="원가"
                                className="text-right text-lg border border-slate-300 shadow-sm p-3 w-full h-14 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>

                        {/* 임대료 입력 필드 */}
                        <div>
                            <label className="flex items-center text-slate-700 mb-2 font-medium">
                                <FaBuilding className="mr-2 text-purple-600" />
                                임대료
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="\d*"
                                value={calcDataC.임대료}
                                onChange={handleInputChange}
                                name="임대료"
                                className="text-right text-lg border border-slate-300 shadow-sm p-3 w-full h-14 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>

                        {/* 관리비 입력 필드 */}
                        <div>
                            <label className="flex items-center text-slate-700 mb-2 font-medium">
                                <FaWrench className="mr-2 text-amber-600" />
                                <span>관리비</span>
                                <div className="ml-2 group relative">
                                    <FaQuestion className="h-4 w-4 text-slate-400" />
                                    <div className="absolute left-0 bottom-6 hidden group-hover:block w-77 p-3 bg-slate-800 text-white text-sm rounded-lg shadow-xl z-10">
                                        관리비는 전기요금, 수도요금, 가스요금, 건물 관리비와 같이 점포를 운영하는 데 필요한 비용이에요.
                                    </div>
                                </div>
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="\d*"
                                value={calcDataC.관리비}
                                onChange={handleInputChange}
                                name="관리비"
                                className="text-right text-lg border border-slate-300 shadow-sm p-3 w-full h-14 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>

                        {/* 급여비 입력 필드 */}
                        <div>
                            <label className="flex items-center text-slate-700 mb-2 font-medium">
                                <FaUsers className="mr-2 text-red-600" />
                                <span>급여비</span>
                                <div className="ml-2 group relative">
                                    <FaQuestion className="h-4 w-4 text-slate-400" />
                                    <div className="absolute left-0 bottom-6 hidden group-hover:block w-68 p-3 bg-slate-800 text-white text-sm rounded-lg shadow-xl z-10">
                                        2025년 월 최저임금 2,096,270원<br />(주 40시간, 주휴시간 35시간 포함 209시간)
                                    </div>
                                </div>
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="\d*"
                                value={calcDataC.급여비}
                                onChange={handleInputChange}
                                name="급여비"
                                className="text-right text-lg border border-slate-300 shadow-sm p-3 w-full h-14 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>

                        {/* 수수료 입력 필드 */}
                        <div>
                            <label className="flex items-center text-slate-700 mb-2 font-medium">
                                <FaCreditCard className="mr-2 text-indigo-600" />
                                <span>수수료</span>
                                <div className="ml-2 group relative">
                                    <FaQuestion className="h-4 w-4 text-slate-400" />
                                    <div className="absolute left-0 bottom-6 hidden group-hover:block w-64 p-3 bg-slate-800 text-white text-sm rounded-lg shadow-xl z-10">
                                        수수료는 로열티, 광고비, 신용카드 수수료와 같이 매출에 따라 발생하는 비용이에요.
                                    </div>
                                </div>
                            </label>
                            <input
                                type="text"
                                inputMode="numeric"
                                pattern="\d*"
                                value={calcDataC.수수료}
                                onChange={handleInputChange}
                                name="수수료"
                                className="text-right text-lg border border-slate-300 shadow-sm p-3 w-full h-14 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                            />
                        </div>
                    </div>
                </div>

                {/* 결과 섹션 */}
                <div className="relative">
                    <div className={`h-full p-6 rounded-xl border-2 ${isPositiveProfit ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'}`}>
                        <h3 className="text-lg font-bold mb-4 text-slate-800">계산 결과</h3>

                        <div className="mb-6">
                            <p className="text-slate-600 mb-1">예상 월 매출이</p>
                            <p className="text-2xl font-bold mb-2">{calcDataC.매출}원</p>
                            <p className="text-slate-600 mb-1">일 때,</p>
                        </div>

                        <div className="mb-6">
                            <p className="text-slate-600 mb-2">수익률은 약</p>
                            <div className={`text-4xl font-extrabold ${isPositiveProfit ? 'text-green-600' : 'text-red-600'}`}>
                                {profitMargin}%
                            </div>
                        </div>

                        <div>
                            <p className="text-slate-600 mb-2">월 수익은</p>
                            <div className={`text-4xl font-extrabold ${isPositiveProfit ? 'text-green-600' : 'text-red-600'}`}>
                                {calculatedProfit.toLocaleString()}원
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* 비용 분석 */}
            <div className="p-6 pt-0">
                <div className="mt-8">
                    <h3 className="text-lg font-bold mb-4 text-slate-800 flex items-center">
                        <FaInfoCircle className="mr-2 text-blue-500" />
                        비용 분석
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                        {costBreakdown.map((item, index) => (
                            <div key={index} className="bg-slate-50 p-4 rounded-lg">
                                <p className="text-sm text-slate-500 mb-1">{item.name}</p>
                                <p className="text-lg font-bold text-slate-800">{item.value.toLocaleString()}원</p>
                                <div className="mt-2 w-full bg-slate-200 rounded-full h-2.5">
                                    <div
                                        className="bg-blue-600 h-2.5 rounded-full"
                                        style={{ width: `${Math.min(item.percent, 100)}%` }}
                                    ></div>
                                </div>
                                <p className="text-xs text-slate-500 mt-1">매출의 {item.percent}%</p>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
