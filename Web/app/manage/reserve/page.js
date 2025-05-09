"use client"

import Manage from "../page";
import React from "react";
import ReserveListStandBy from "@/components/feature/reserve/reserve_list_standby";
import ReserveListApprove from "@/components/feature/reserve/reserve_list_approve";
import ReserveListHistory from "@/components/feature/reserve/reserve_list_history";

export default function ManageReserve() {
    const [openTab, setOpenTab] = React.useState(1);

    return (
        <Manage>
            <div className="p-4">
                <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700">
                    <h2 className="mb-5 font-bold text-xl text-3xl mb-2 text-black">예약 관리</h2>

                    <ul className="flex mb-0 list-none flex-wrap pt-3 pb-4 flex-row" role="tablist" >
                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a
                                className={
                                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                    (openTab === 1
                                        ? "text-white bg-amber-600"
                                        : "text-amber-600 bg-white")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(1);
                                }}
                                data-toggle="tab"
                                href="#link1"
                                role="tablist"
                            >
                                예약 대기
                            </a>
                        </li>
                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a
                                className={
                                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                    (openTab === 2
                                        ? "text-white bg-amber-600"
                                        : "text-amber-600 bg-white")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(2);
                                }}
                                data-toggle="tab"
                                href="#link2"
                                role="tablist"
                            >
                                예약 승인
                            </a>
                        </li>
                        <li className="-mb-px mr-2 last:mr-0 flex-auto text-center">
                            <a
                                className={
                                    "text-xs font-bold uppercase px-5 py-3 shadow-lg rounded block leading-normal " +
                                    (openTab === 3
                                        ? "text-white bg-amber-600"
                                        : "text-amber-600 bg-white")
                                }
                                onClick={e => {
                                    e.preventDefault();
                                    setOpenTab(3);
                                }}
                                data-toggle="tab"
                                href="#link3"
                                role="tablist"
                            >
                                예약 기록
                            </a>
                        </li>
                    </ul>

                    <div className="relative flex flex-col min-w-0 break-words bg-white w-full mb-6 shadow-lg rounded">
                        <div className="px-4 py-5 flex-auto">
                            <div className="tab-content tab-space">
                                {openTab === 1 && <ReserveListStandBy key={openTab} />}
                                {openTab === 2 && <ReserveListApprove key={openTab} />}
                                {openTab === 3 && <ReserveListHistory key={openTab} />}
                            </div>
                        </div>
                    </div>



                </div>
            </div>
        </Manage>
    );
}