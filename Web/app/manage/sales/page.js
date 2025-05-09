'use client'
import dynamic from 'next/dynamic';
import Manage from "../page";
import ManageNavBar from "@/components/feature/manage_navbar";
import React, { useEffect, useState } from 'react';

const SalesDaily = dynamic(() => import('@/components/feature/sales/sales_daily'), { ssr: false });
const SalesCalc = dynamic(() => import('@/components/feature/sales/sales_calc'), { ssr: false });

export default function ManageCalc() {
    const [openTab, setOpenTab] = React.useState(1);

    return (
        <Manage>

            <div className="p-4">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                    <h2 className="mb-5 font-bold text-xl text-3xl text-black">매출 계산기</h2>
                    {/* <h2 className="mb-5 font-bold text-xl text-3xl mb-10 text-black">매출 계산기</h2> */}

                    <ul className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row" role="tablist" >
                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a className={"text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " + (openTab === 1 ? "text-white bg-amber-600" : "text-amber-600 bg-white")}
                                onClick={e => { e.preventDefault(); setOpenTab(1); }}
                                data-toggle="tab"
                                href="#link1"
                                role="tablist">일별 매출</a>
                        </li>
                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a className={"text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " + (openTab === 2 ? "text-white bg-amber-600" : "text-amber-600 bg-white")}
                                onClick={e => { e.preventDefault(); setOpenTab(2); }}
                                data-toggle="tab"
                                href="#link2"
                                role="tablist">메뉴별 매출</a>
                        </li>
                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a className={"text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " + (openTab === 3 ? "text-white bg-amber-600" : "text-amber-600 bg-white")}
                                onClick={e => { e.preventDefault(); setOpenTab(3); }}
                                data-toggle="tab"
                                href="#link3"
                                role="tablist">월별 매출</a>
                        </li>
                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a className={"text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " + (openTab === 4 ? "text-white bg-amber-600" : "text-amber-600 bg-white")}
                                onClick={e => { e.preventDefault(); setOpenTab(4); }}
                                data-toggle="tab"
                                href="#link3"
                                role="tablist">매출 계산기</a>
                        </li>
                    </ul>


                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                        <div className="px-4 py-5 flex-auto">
                            <div className="tab-content tab-space">
                                <div className={(openTab === 1 ? "block" : "hidden")} id="link1">
                                    <SalesDaily key={openTab === 1 ? "sales-daily" : "sales-daily-hidden"} />
                                </div>
                                <div className={(openTab === 2 ? "block" : "hidden")} id="link2">

                                </div>
                                <div className={openTab === 3 ? "block" : "hidden"} id="link3">

                                </div>
                                <div className={openTab === 4 ? "block" : "hidden"} id="link4">
                                    <SalesCalc />
                                </div>

                            </div>
                        </div>
                    </div>
                </div>
            </div>

        </Manage >
    );
}