import React, { useEffect, useState } from 'react';
import { supabaseClient } from '@/lib/supabase';

export default function ReserveListStandBy() {
    const [reserved, setReserved] = useState([]);
    const [users, setUsers] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    let now = new Date();
    let year = (now.getFullYear());
    let month = ("0" + (now.getMonth() + 1)).slice(-2);
    let day = ("0" + now.getDate()).slice(-2);
    let hours = (now.getHours());
    var time = year + "-" + month + "-" + day + " " + hours;

    const fetchDate = async () => {
        const { data: { user } } = await supabaseClient.auth.getUser()
        if (user) {
            const { data: u_data } = await supabaseClient.from('profile_data').select(`*`).eq('id', user.id).single();
            var b_id = u_data.b_id;

            // const { data: reserveData } = await supabaseClient.from('reserve_data').select(`*`).eq('b_id', b_id).order("date", { ascending: true }).order("time", { ascending: true });
            const { data: reserveData } = await supabaseClient.from('reserve_data').select(`*`).eq('b_id', b_id).eq('status', "standby").order("date", { ascending: true }).order("time", { ascending: true });

            setReserved(reserveData);
            var temp = [];
            reserveData.map((reserve, index) => {
                if (reserve.status == "standby" && reserve.date + " " + reserve.time >= time) {
                    temp.push(reserve.uuid);
                }
            });
            const { data: userData } = await supabaseClient.from('profile_data').select(`*`).in('id', temp);
            setUsers(userData);
            setIsLoading(false);
        }
    }

    useEffect(() => {
        fetchDate()
    }, []);

    async function approveReserve(id) {
        const { error } = await supabaseClient
            .from('reserve_data')
            .update({ status: 'approve' })
            .eq('id', parseInt(id))
        setIsLoading(true);
        fetchDate();
    }
    async function cancelReserve(id) {
        const { error } = await supabaseClient
            .from('reserve_data')
            .update({ status: 'cancel' })
            .eq('id', id)
        setIsLoading(true);
        fetchDate();
    }

    return (
        <div>
            {
                isLoading ?
                    <div className="flex flex-row mx-auto my-20 md:-my-20 h-screen justify-center md:items-center">
                        <div className="w-40 h-40 rounded-full animate-spin 
                            border-2 border-solid border-blue-500 border-t-transparent"></div>
                    </div>
                    :
                    <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4">
                        {
                            reserved != null && reserved.length > 0 ? reserved.map((reserve, index) => (
                                reserve.status == "standby" && reserve.date + " " + reserve.time >= time &&
                                <div key={index} className="flex w-full border rounded-lg my-2">

                                    <div className="flex flex-col w-full">
                                        <div className="flex w-full">
                                            <div className="flex flex-col w-full ml-2 mt-4">
                                                <p className="font-normal mt-1">예약 인원 - {reserve.count}명</p>
                                                <p className="font-normal mt-1">예약 시간 - {reserve.date.replaceAll('-', '.') + " " + reserve.time}</p>
                                                <p className="font-normal mt-1">예약 시간 - {reserve.r_time.replaceAll('-', '.')}</p>
                                                {/* <p className="font-normal mt-1">예약자 - {users.filter((user) => user.id == reserve.uuid).map((user) => user.name)}</p> */}
                                                <p className="font-normal mt-1">코멘트 - {reserve.comment}</p>
                                            </div>
                                        </div>

                                        <div className="flex w-full">
                                            <button onClick={() => approveReserve(reserve.id)} className="flex-1 px-4 py-2 bg-green-100 font-bold rounded-l-lg">승인</button>
                                            <button onClick={() => cancelReserve(reserve.id)} className="flex-1 px-4 py-2 bg-red-100 font-bold rounded-r-lg">취소</button>
                                        </div>

                                    </div>
                                </div>
                            )) :
                                <div className='flex flex-col h-[70vh] justify-center'>
                                    <p className=''>승인대기중인 예약이 없습니다.</p>
                                </div>
                        }
                    </div>
            }
        </div>
    );
}