"use client"

import { supabaseClient } from "@/lib/supabase";
import Image from "next/image";
import { useEffect, useState, useRef } from "react";
import Manage from "../page";
import { FaStore, FaMapMarkerAlt, FaClock, FaFileAlt, FaTags, FaImage, FaSave } from "react-icons/fa";

export default function ManageInfo() {
    const photoInput = useRef(null);
    const [userData, setUserData] = useState({
        b_id: 0,
    });
    const [isLoading, setIsLoading] = useState(true);
    const [image, setImage] = useState(null);
    const [isImageChanged, setIsImageChanged] = useState(false);
    const [business, setBusiness] = useState([]);
    const [updateBusiness, setUpdateBusiness] = useState({
        image: "",
        name: "",
        address: "",
        time: "",
        description: "",
        tags: "",
    });
    const [photoToAddList, setPhotoToAddList] = useState([]);
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        const fetchMenus = async () => {
            const { data: { user } } = await supabaseClient.auth.getUser()
            if (user) {
                const { data: u_data } = await supabaseClient.from('profile_data').select(`*`).eq('id', user.id).single();
                setUserData({
                    b_id: u_data.b_id
                })
                var b_id = u_data.b_id;

                const { data } = await supabaseClient.from('business_data').select("*").eq('id', b_id);
                setBusiness(data)
                setUpdateBusiness({
                    image: data[0].image,
                    name: data[0].name,
                    address: data[0].address,
                    time: data[0].time,
                    description: data[0].description,
                    tags: data[0].tags
                })
                setPhotoToAddList(data[0].image);
                setIsLoading(false)
            }
        }
        fetchMenus()
    }, []);

    const updateInfo = async (e) => {
        e.preventDefault();
        setIsSaving(true);

        try {
            if (image != null) {
                const { data: uploadImage, error: uploadImageError } = await supabaseClient.storage.from("images").upload("menu_images/" + String(userData.b_id) + "/main/" + encodeFilename(image?.name), image);
                if (uploadImageError) {
                    console.error(uploadImageError);
                }
            }

            business[0].image = updateBusiness.image;

            await supabaseClient
                .from('business_data')
                .update({
                    image: updateBusiness.image,
                    name: updateBusiness.name,
                    address: updateBusiness.address,
                    time: updateBusiness.time,
                    description: updateBusiness.description,
                    tags: updateBusiness.tags
                })
                .eq("id", userData.b_id);

            if (isImageChanged) {
                await sleep(2);
                setIsImageChanged(false);
            }

            // 성공 메시지 표시
            alert("가게 정보가 성공적으로 업데이트되었습니다.");
        } catch (error) {
            console.error("업데이트 중 오류 발생:", error);
            alert("저장 중 오류가 발생했습니다. 다시 시도해 주세요.");
        } finally {
            setIsSaving(false);
        }
    }

    const handleInputImageChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            setImage(e.target.files[0]);
            updateBusiness.image = "https://cytktlrbanxiswqurqth.supabase.co/storage/v1/object/public/images/menu_images/" + String(userData.b_id) + "/main/" + encodeFilename(e.target.files[0].name);
            business[0].image = updateBusiness.image;
            setIsImageChanged(true);
            setPhotoToAddList(URL.createObjectURL(e.target.files[0]));
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setUpdateBusiness({ ...updateBusiness, [e.target.name]: value });
    };

    function encodeFilename(filename) {
        return Buffer.from(filename).toString('base64');
    }

    function sleep(sec) {
        return new Promise(resolve => setTimeout(resolve, sec * 1000));
    }

    // 아직 데이터가 로딩 중인 경우
    if (isLoading) {
        return (
            <Manage>
                <div className="flex flex-row mx-auto my-20 md:-my-20 h-screen justify-center md:items-center">
                    <div className="w-40 h-40 rounded-full animate-spin 
                            border-2 border-solid border-blue-500 border-t-transparent"></div>
                </div>
            </Manage>
        );
    }

    return (
        <Manage>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                <div className="container mx-auto px-[30px] py-[30px]">
                    <div className="flex justify-between items-center mb-6">
                        <h1 className="text-2xl font-bold text-slate-800">가게 정보 관리</h1>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        {/* 가게 기본 정보 카드 */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center space-x-2 mb-6">
                                <FaStore className="h-6 w-6 text-blue-500" />
                                <h3 className="text-lg font-bold text-slate-800">기본 정보</h3>
                            </div>

                            <div className="space-y-5">
                                <div>
                                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                        <FaStore className="mr-2 text-blue-500" size={14} />
                                        가게 이름
                                    </label>
                                    <input
                                        type="text"
                                        name="name"
                                        onChange={handleInputChange}
                                        value={updateBusiness.name}
                                        placeholder="가게 이름을 입력하세요"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                        <FaMapMarkerAlt className="mr-2 text-red-500" size={14} />
                                        가게 주소
                                    </label>
                                    <input
                                        type="text"
                                        name="address"
                                        onChange={handleInputChange}
                                        value={updateBusiness.address}
                                        placeholder="가게 주소를 입력하세요"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                        <FaClock className="mr-2 text-amber-500" size={14} />
                                        영업 시간
                                    </label>
                                    <input
                                        type="text"
                                        name="time"
                                        onChange={handleInputChange}
                                        value={updateBusiness.time}
                                        placeholder="영업 시간을 입력하세요 (예: 09:00-22:00)"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                        <FaFileAlt className="mr-2 text-green-500" size={14} />
                                        가게 소개
                                    </label>
                                    <textarea
                                        name="description"
                                        onChange={handleInputChange}
                                        value={updateBusiness.description}
                                        placeholder="가게를 소개하는 글을 입력하세요"
                                        rows={3}
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                </div>

                                <div>
                                    <label className="flex items-center text-sm font-semibold text-slate-700 mb-2">
                                        <FaTags className="mr-2 text-purple-500" size={14} />
                                        태그
                                    </label>
                                    <input
                                        type="text"
                                        name="tags"
                                        onChange={handleInputChange}
                                        value={updateBusiness.tags}
                                        placeholder="태그를 입력하세요 (예: 양식,데이트,코스요리)"
                                        className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                                    />
                                    <div className="mt-2 text-xs text-slate-500">
                                        <p>- 띄어쓰기 없이 쉼표로 태그를 구분해 주세요.</p>
                                        <p>- 예시) 양식,데이트,코스요리</p>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* 이미지 관리 카드 */}
                        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                            <div className="flex items-center space-x-2 mb-6">
                                <FaImage className="h-6 w-6 text-green-500" />
                                <h3 className="text-lg font-bold text-slate-800">대표 이미지</h3>
                            </div>

                            <div className="flex flex-col h-full">
                                <div className="flex-grow">
                                    <div className="mb-4">
                                        <p className="text-sm font-semibold text-slate-700 mb-2">현재 이미지</p>
                                        <div className="overflow-hidden rounded-xl border border-slate-200 aspect-video shadow-sm">
                                            <Image
                                                className="w-full h-full object-cover transition-transform hover:scale-105"
                                                src={photoToAddList}
                                                alt={'가게 대표 이미지'}
                                                width={500}
                                                height={300}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-4">
                                        <p className="text-sm font-semibold text-slate-700 mb-2">이미지 변경</p>
                                        <div className="relative">
                                            <input
                                                name="menu_image"
                                                ref={photoInput}
                                                onChange={handleInputImageChange}
                                                type="file"
                                                accept="image/*"
                                                className="w-full px-4 py-2.5 text-sm text-slate-500 
                                                        file:mr-4 file:py-2 file:px-4 file:rounded-md
                                                        file:border-0 file:text-sm file:font-medium
                                                        file:bg-blue-50 file:text-blue-700
                                                        hover:file:bg-blue-100
                                                        border border-slate-200 rounded-lg
                                                        focus:outline-none focus:border-blue-500"
                                            />
                                        </div>
                                        <p className="mt-2 text-xs text-slate-500">
                                            - 권장 이미지 크기: 1200 x 800px (3:2 비율)
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 저장 버튼 */}
                    <div className="flex justify-end">
                        <button
                            onClick={updateInfo}
                            disabled={isSaving}
                            className={`flex items-center space-x-2 px-6 py-3 rounded-lg shadow-sm font-medium 
                                    ${isSaving
                                    ? 'bg-blue-300 cursor-not-allowed'
                                    : 'bg-blue-600 hover:bg-blue-700 active:bg-blue-800'} 
                                    text-white transition-all duration-200`}
                        >
                            <FaSave className="h-4 w-4" />
                            <span>{isSaving ? '저장 중...' : '변경사항 저장'}</span>
                        </button>
                    </div>
                </div>
            </div>
        </Manage>
    );
}
