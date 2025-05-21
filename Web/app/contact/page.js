'use client'

import { supabaseClient } from "@/lib/supabase";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Contact() {
    const router = useRouter(); // 추가: router 객체 초기화
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const [enrollData, setEnrollData] = useState({
        name: '',
        b_name: '',
        contact: '',
        address: '',
    });

    const handleInputChange = (e) => {
        setEnrollData({ ...enrollData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const { data: enroll, error: enrollError } = await supabaseClient
                .from("contact_data")
                .insert([
                    {
                        name: enrollData.name,
                        b_name: enrollData.b_name,
                        contact: enrollData.contact,
                        address: enrollData.address,
                    },
                ]);

            if (enrollError) throw enrollError;

            setIsSuccess(true);
            setTimeout(() => {
                router.push('/');
            }, 3000);
        } catch (error) {
            console.error("Error submitting form:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12">
            {isLoading ? (
                <div className="flex flex-col items-center justify-center h-screen">
                    <div className="w-20 h-20 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin mb-6"></div>
                    <p className="text-lg text-gray-700">신청서를 처리 중입니다...</p>
                </div>
            ) : isSuccess ? (
                <div className="max-w-md mx-auto text-center bg-white p-10 rounded-2xl shadow-xl">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">신청이 완료되었습니다!</h2>
                    <p className="text-gray-600 mb-6">빠른 시일 내에 담당자가 연락드릴 예정입니다.<br />곧 메인 페이지로 이동합니다.</p>
                </div>
            ) : (
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
                        <div className="flex flex-col md:flex-row">
                            <div className="bg-indigo-600 text-white md:w-1/3 p-8 md:p-12 flex flex-col justify-between">
                                <div>
                                    <h2 className="text-3xl font-bold mb-6">가치가게와 함께 성장하세요</h2>
                                    <p className="mb-8 opacity-90">
                                        지금 가입하시면 3개월 무료 체험과 함께 전담 매니저의 특별한 지원을 받으실 수 있습니다.
                                    </p>

                                    <div className="space-y-4 mb-10">
                                        <div className="flex items-start">
                                            <svg className="h-6 w-6 text-yellow-300 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>무료 초기 설정 지원</span>
                                        </div>
                                        <div className="flex items-start">
                                            <svg className="h-6 w-6 text-yellow-300 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>1:1 전담 매니저 배정</span>
                                        </div>
                                        <div className="flex items-start">
                                            <svg className="h-6 w-6 text-yellow-300 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            <span>첫 3개월 무료 이용</span>
                                        </div>
                                    </div>
                                </div>

                                <Link href="/" className="text-yellow-300 hover:text-white transition flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                                    </svg>
                                    메인 페이지로 돌아가기
                                </Link>
                            </div>

                            <div className="p-8 md:p-12 md:w-2/3">
                                <div className="text-center mb-8">
                                    <h2 className="text-2xl font-bold text-gray-800 mb-2">서비스 신청하기</h2>
                                    <p className="text-gray-600">아래 정보를 입력하시면 담당자가 빠르게 연락드립니다</p>
                                </div>

                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <label htmlFor="name" className="block mb-2 font-semibold text-gray-700">대표자명</label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            placeholder="이름을 입력해주세요"
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="b_name" className="block mb-2 font-semibold text-gray-700">업체명</label>
                                        <input
                                            type="text"
                                            id="b_name"
                                            name="b_name"
                                            placeholder="업체명을 입력해주세요"
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="contact" className="block mb-2 font-semibold text-gray-700">연락처</label>
                                        <input
                                            type="text"
                                            id="contact"
                                            name="contact"
                                            placeholder="010-0000-0000"
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                        />
                                    </div>

                                    <div>
                                        <label htmlFor="address" className="block mb-2 font-semibold text-gray-700">업체 주소</label>
                                        <input
                                            type="text"
                                            id="address"
                                            name="address"
                                            placeholder="매장 주소를 입력해주세요"
                                            onChange={handleInputChange}
                                            required
                                            className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                                        />
                                    </div>

                                    <div className="flex items-start">
                                        <input
                                            type="checkbox"
                                            id="consent"
                                            required
                                            className="mt-1 h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                                        />
                                        <label htmlFor="consent" className="ml-3 text-sm text-gray-700">
                                            <span className="font-medium">개인정보 수집 및 이용</span>에 동의합니다.<br />제공해주신 정보는 서비스 안내를 위한 목적으로만 사용됩니다.
                                        </label>
                                    </div>

                                    <div className="pt-2">
                                        <button
                                            type="submit"
                                            className="w-full px-6 py-4 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                        >
                                            무료 체험 신청하기
                                        </button>
                                    </div>
                                </form>

                                <div className="mt-8 text-center text-sm text-gray-500">
                                    <div className="flex justify-center mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                        개인 정보는 안전하게 보호됩니다
                                    </div>
                                    <p>가입 후 언제든지 해지 가능하며, 약정이 없습니다.</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
