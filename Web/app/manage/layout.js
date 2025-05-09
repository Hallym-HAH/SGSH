"use client"

import ManageNavBar from "@/components/feature/manage_navbar";
import ManageSideBar from "@/components/feature/manage_sidebar";
import { supabaseClient } from '@/lib/supabase';
import Link from "next/link";
import { useEffect, useState } from "react";


export default function ManageLayout({ children }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [userData, setUserData] = useState({
        b_id: 0,
    });

    useEffect(() => {
        const fetchData = async () => {
            const { data: { user } } = await supabaseClient.auth.getUser()
            user && setIsLoggedIn(true)
            if (user) {
                const { data } = await supabaseClient.from('profile_data').select(`*`).eq('id', user.id).single();
                setUserData({
                    b_id: data.b_id
                })
            }
        }
        fetchData()
    }, [])

    async function signOut() {
        const { error } = await supabaseClient.auth.signOut()
        setIsLoggedIn(false)
        window.location.reload();
    }
    async function signInWithKakao() {
        const { data, error } = await supabaseClient.auth.signInWithOAuth({
            provider: "kakao",
            options: {
                redirectTo: 'http://localhost:3000/manage',
            }
        })
    }

    return (
        <>
            {isLoggedIn && userData.b_id > 0 ?
                <div className="flex flex-row min-h-screen bg-[#f9fafb]">
                    < ManageSideBar />
                    <div className="w-full md:ml-64">
                        <ManageNavBar />
                        {children}
                    </div>
                </div > :
                <div>
                    <nav className="w-full bg-white border-b border-[#e4e7ec] sticky top-0 z-10">
                        <div className="justify-start pl-6 pr-2 md:px-2 lg:max-w-9xl md:items-center md:flex md:px-8">
                            <div className="flex w-full items-center justify-between py-3 md:py-5 md:block ">
                                <div className="flex w-full items-center justify-center">
                                    <Link href="/">
                                        <h2 className="text-2xl text-black font-bold">가치가게</h2>
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </nav>
                    {isLoggedIn && (userData.b_id == 0 || !userData.b_id) ?
                        <div className="flex flex-col w-full h-200 justify-center items-center gap-y-10">
                            <p className="text-xl font-bold">권한이 없습니다.</p>
                            <a className="font-bold" onClick={signOut}>로그아웃</a>
                        </div>
                        :
                        <div className="flex w-full h-200 justify-center items-center">
                            <a className="font-bold" onClick={signInWithKakao}>로그인</a>
                        </div>
                    }
                </div>
            }
        </>
    );
}