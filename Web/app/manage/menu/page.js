'use client'

import Manage from "../page";
import { supabaseClient } from '@/lib/supabase';
import React, { useEffect, useState, useRef } from 'react';
import Image from 'next/image';
import { FaUtensils, FaCoffee, FaClipboardList, FaPlus, FaEdit, FaTrash, FaImage, FaMoneyBillWave, FaAlignLeft, FaQuestionCircl, FaSave } from "react-icons/fa";

export default function ManageMenu() {
    const photoInput = useRef(null);
    const [userData, setUserData] = useState({ b_id: 0 });
    const [isLoading, setIsLoading] = useState(true);
    const [image, setImage] = useState(null);
    const [menus, setMenus] = useState([]);
    const [showModal, setShowModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [dateFormat, setDateFormat] = useState();
    const [photoToAddList, setPhotoToAddList] = useState([]);
    const [menuCounts, setMenuCounts] = useState({ food: 0, drink: 0, order: 0 });

    const [menuData, setMenuData] = useState({
        menu_image: '',
        menu_name: '',
        menu_price: 0,
        menu_description: '',
        menu_category: 1
    });

    const [menuEditData, setMenuEditData] = useState({
        edit_id: 0,
        edit_name: '',
        edit_description: '',
        edit_price: 0,
        edit_category: 1
    });

    const { menu_image, menu_name, menu_price, menu_description, menu_category } = menuData;
    const { edit_id, edit_name, edit_description, edit_price, edit_category } = menuEditData;

    // 이미지 변경 핸들러
    const handleInputImageChange = (e) => {
        if (e.target.files != null) {
            setImage(e.target.files[0]);
            menuData.menu_image = "https://cytktlrbanxiswqurqth.supabase.co/storage/v1/object/public/images/menu_images/" + String(userData.b_id) + "/" + dateFormat + encodeFilename(e.target.files[0].name);
            setPhotoToAddList(URL.createObjectURL(e.target.files[0]));
        }
    };

    // 입력 필드 변경 핸들러
    const handleInputChange = (e) => {
        setMenuData({ ...menuData, [e.target.name]: e.target.value });
    };

    // 메뉴 추가 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (image != null) {
                await supabaseClient.storage.from("images").upload(
                    "menu_images/" + String(userData.b_id) + "/" + dateFormat + encodeFilename(image?.name),
                    image
                );
            }

            await supabaseClient.from("menu_data").insert([
                {
                    b_id: userData.b_id,
                    name: menu_name,
                    price: menu_price,
                    description: menu_description,
                    image: menu_image,
                    category: menu_category
                },
            ]);

            // 메뉴 목록 갱신
            const { data } = await supabaseClient.from('menu_data')
                .select("*")
                .eq('b_id', userData.b_id)
                .order("id", { ascending: true });

            setMenus(data);
            updateMenuCounts(data);
            closeModal();
        } catch (error) {
            console.error("메뉴 추가 중 오류 발생:", error);
        }
    };

    // 메뉴 데이터 불러오기
    useEffect(() => {
        const fetchMenus = async () => {
            try {
                const { data: { user } } = await supabaseClient.auth.getUser();
                if (user) {
                    const { data: u_data } = await supabaseClient.from('profile_data').select(`*`).eq('id', user.id).single();
                    setUserData({ b_id: u_data.b_id });
                    const { data } = await supabaseClient.from('menu_data').select("*").eq('b_id', u_data.b_id).order("id", { ascending: true });
                    setMenus(data);
                    updateMenuCounts(data);
                    setIsLoading(false);
                }
            } catch (error) {
                console.error("메뉴 데이터 불러오기 오류:", error);
                setIsLoading(false);
            }
        };

        fetchMenus();
    }, []);

    // 메뉴 카테고리별 개수 업데이트
    const updateMenuCounts = (data) => {
        if (!data) return;

        const counts = {
            food: data.filter(menu => menu.category === 1).length,
            drink: data.filter(menu => menu.category === 2).length,
            order: data.filter(menu => menu.category === 3).length
        };

        setMenuCounts(counts);
    };

    // 모달 제어 함수들
    function openModal() {
        let date = new Date();
        setDateFormat(date.getFullYear().toString() + ("0" + (date.getMonth() + 1)).slice(-2) + ("0" + date.getDate()).slice(-2) + date.getHours() + date.getMinutes() + date.getSeconds());
        setShowModal(true);
        setMenuData({
            menu_image: "",
            menu_name: "",
            menu_price: 0,
            menu_description: "",
            menu_category: 1
        });
    }

    function closeModal() {
        setMenuData({
            menu_image: "",
            menu_name: "",
            menu_price: 0,
            menu_description: "",
            menu_category: 1
        });
        setShowModal(false);
    }

    function openEditModal(e) {
        setPhotoToAddList(e.image);
        setMenuEditData({
            edit_id: e.id,
            edit_name: e.name,
            edit_description: e.description,
            edit_price: e.price,
            edit_category: e.category || 1
        });
        setShowEditModal(true);
    }

    function closeEditModal() {
        setMenuEditData({
            edit_id: 0,
            edit_name: "",
            edit_description: "",
            edit_price: 0,
            edit_category: 1
        });
        setShowEditModal(false);
    }

    // 메뉴 수정 핸들러
    const handleEditInputChange = (e) => {
        setMenuEditData({ ...menuEditData, [e.target.name]: e.target.value });
    };

    // 숫자 입력 필드 이벤트 처리
    const numberInputOnWheelPreventChange = (e) => {
        e.target.blur();
        e.stopPropagation();
        setTimeout(() => {
            e.target.focus();
        }, 0);
    };

    // 이미지 미리보기
    const photoToAddPreview = () => {
        return (
            <div className="w-full h-60 overflow-hidden rounded-xl border border-slate-200">
                <Image
                    className="w-full h-full object-cover"
                    src={photoToAddList}
                    alt={'메뉴 이미지'}
                    width={500}
                    height={500}
                />
            </div>
        );
    };

    // 메뉴 수정 제출 핸들러
    const handleEditSubmit = async (e) => {
        e.preventDefault();

        try {
            if (image != null) {
                await supabaseClient.storage.from("images").upload(
                    "menu_images/" + String(userData.b_id) + "/" + encodeFilename(image?.name),
                    image
                );
            }

            await supabaseClient.from("menu_data").update([{
                name: edit_name,
                description: edit_description,
                price: edit_price,
                category: edit_category
            }]).eq('id', edit_id);

            // 메뉴 목록 갱신
            const { data } = await supabaseClient.from('menu_data')
                .select("*")
                .eq('b_id', userData.b_id)
                .order("id", { ascending: true });

            setMenus(data);
            updateMenuCounts(data);
            closeEditModal();
        } catch (error) {
            console.error("메뉴 수정 중 오류 발생:", error);
        }
    };

    // 메뉴 삭제 함수
    async function deleteItem() {
        try {
            await supabaseClient.from('menu_data').delete().eq('id', edit_id);

            // 메뉴 목록 갱신
            const { data } = await supabaseClient.from('menu_data')
                .select("*")
                .eq('b_id', userData.b_id)
                .order("id", { ascending: true });

            setMenus(data);
            updateMenuCounts(data);
            closeEditModal();
        } catch (error) {
            console.error("메뉴 삭제 중 오류 발생:", error);
        }
    }

    // 파일명 인코딩
    function encodeFilename(filename) {
        return Buffer.from(filename).toString('base64');
    }

    return (
        <Manage>
            <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
                {isLoading ? (
                    <div className="flex flex-row mx-auto my-20 md:-my-20 h-screen justify-center md:items-center">
                        <div className="w-40 h-40 rounded-full animate-spin border-2 border-solid border-blue-500 border-t-transparent"></div>
                    </div>
                ) : (
                    <div className="container mx-auto">
                        <div className="flex justify-between items-center px-[30px] pt-[30px] mb-4">
                            <h1 className="text-2xl font-bold text-slate-800">메뉴 관리</h1>
                            <button
                                onClick={openModal}
                                className="flex items-center space-x-2 px-5 py-2.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-sm"
                            >
                                <FaPlus className="h-4 w-4" />
                                <span>새 메뉴 추가</span>
                            </button>
                        </div>

                        {/* 메뉴 요약 통계 */}
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 px-[30px] mb-6">
                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px] flex flex-col justify-between">
                                <div className="p-6 flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-sm font-semibold text-slate-500">요리 메뉴</h2>
                                        <div className="p-2 bg-orange-500/10 rounded-full">
                                            <FaUtensils className="h-5 w-5 text-orange-500" />
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold text-slate-800">{menuCounts.food}<span className="ml-1 text-lg font-medium text-slate-600">개</span></p>
                                </div>
                                <div className="h-1 bg-gradient-to-r from-orange-500 to-orange-600 w-full"></div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px] flex flex-col justify-between">
                                <div className="p-6 flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-sm font-semibold text-slate-500">음료 메뉴</h2>
                                        <div className="p-2 bg-blue-500/10 rounded-full">
                                            <FaCoffee className="h-5 w-5 text-blue-500" />
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold text-slate-800">{menuCounts.drink}<span className="ml-1 text-lg font-medium text-slate-600">개</span></p>
                                </div>
                                <div className="h-1 bg-gradient-to-r from-blue-500 to-blue-600 w-full"></div>
                            </div>

                            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden transition-all hover:shadow-md hover:translate-y-[-2px] flex flex-col justify-between">
                                <div className="p-6 flex-1">
                                    <div className="flex items-center justify-between mb-3">
                                        <h2 className="text-sm font-semibold text-slate-500">주문 메뉴</h2>
                                        <div className="p-2 bg-green-500/10 rounded-full">
                                            <FaClipboardList className="h-5 w-5 text-green-500" />
                                        </div>
                                    </div>
                                    <p className="text-3xl font-bold text-slate-800">{menuCounts.order}<span className="ml-1 text-lg font-medium text-slate-600">개</span></p>
                                </div>
                                <div className="h-1 bg-gradient-to-r from-green-500 to-green-600 w-full"></div>
                            </div>
                        </div>

                        {/* 메뉴 목록 섹션 */}
                        <div className="px-[30px] pb-[30px]">
                            {/* 요리 메뉴 */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                                <div className="flex items-center space-x-2 mb-6">
                                    <FaUtensils className="h-6 w-6 text-orange-500" />
                                    <h3 className="text-lg font-bold text-slate-800">요리</h3>
                                </div>

                                {menus && menus.filter(menu => menu.category === 1).length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {menus.filter(menu => menu.category === 1).map((menu) => (
                                            <div
                                                key={menu.id}
                                                onClick={() => openEditModal(menu)}
                                                className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer flex"
                                            >
                                                <div className="w-1/3 h-full">
                                                    {menu.image && (
                                                        <Image
                                                            src={menu.image}
                                                            width={150}
                                                            height={150}
                                                            alt={menu.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1 p-4">
                                                    <h4 className="font-bold text-lg text-slate-800 mb-1">{menu.name}</h4>
                                                    <p className="text-sm text-slate-500 mb-2 line-clamp-2">{menu.description}</p>
                                                    <p className="text-orange-600 font-bold">{menu.price.toLocaleString()}원</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-slate-50 rounded-xl">
                                        <p className="text-slate-500">등록된 요리 메뉴가 없습니다.</p>
                                        <button
                                            onClick={openModal}
                                            className="mt-3 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                                        >
                                            <FaPlus className="mr-2 h-4 w-4" />
                                            요리 메뉴 추가하기
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* 음료 메뉴 */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 mb-6">
                                <div className="flex items-center space-x-2 mb-6">
                                    <FaCoffee className="h-6 w-6 text-blue-500" />
                                    <h3 className="text-lg font-bold text-slate-800">음료</h3>
                                </div>

                                {menus && menus.filter(menu => menu.category === 2).length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {menus.filter(menu => menu.category === 2).map((menu) => (
                                            <div
                                                key={menu.id}
                                                onClick={() => openEditModal(menu)}
                                                className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer flex"
                                            >
                                                <div className="w-1/3 h-full">
                                                    {menu.image && (
                                                        <Image
                                                            src={menu.image}
                                                            width={150}
                                                            height={150}
                                                            alt={menu.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1 p-4">
                                                    <h4 className="font-bold text-lg text-slate-800 mb-1">{menu.name}</h4>
                                                    <p className="text-sm text-slate-500 mb-2 line-clamp-2">{menu.description}</p>
                                                    <p className="text-blue-600 font-bold">{menu.price.toLocaleString()}원</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-slate-50 rounded-xl">
                                        <p className="text-slate-500">등록된 음료 메뉴가 없습니다.</p>
                                        <button
                                            onClick={openModal}
                                            className="mt-3 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                                        >
                                            <FaPlus className="mr-2 h-4 w-4" />
                                            음료 메뉴 추가하기
                                        </button>
                                    </div>
                                )}
                            </div>

                            {/* 주문 메뉴 */}
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                                <div className="flex items-center space-x-2 mb-6">
                                    <FaClipboardList className="h-6 w-6 text-green-500" />
                                    <h3 className="text-lg font-bold text-slate-800">주문</h3>
                                </div>

                                {menus && menus.filter(menu => menu.category === 3).length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {menus.filter(menu => menu.category === 3).map((menu) => (
                                            <div
                                                key={menu.id}
                                                onClick={() => openEditModal(menu)}
                                                className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-all cursor-pointer flex"
                                            >
                                                <div className="w-1/3 h-full">
                                                    {menu.image && (
                                                        <Image
                                                            src={menu.image}
                                                            width={150}
                                                            height={150}
                                                            alt={menu.name}
                                                            className="w-full h-full object-cover"
                                                        />
                                                    )}
                                                </div>
                                                <div className="flex-1 p-4">
                                                    <h4 className="font-bold text-lg text-slate-800 mb-1">{menu.name}</h4>
                                                    <p className="text-sm text-slate-500 mb-2 line-clamp-2">{menu.description}</p>
                                                    <p className="text-green-600 font-bold">{menu.price.toLocaleString()}원</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-8 bg-slate-50 rounded-xl">
                                        <p className="text-slate-500">등록된 주문 메뉴가 없습니다.</p>
                                        <button
                                            onClick={openModal}
                                            className="mt-3 inline-flex items-center px-4 py-2 text-sm font-medium text-blue-600 bg-blue-50 rounded-lg hover:bg-blue-100"
                                        >
                                            <FaPlus className="mr-2 h-4 w-4" />
                                            주문 메뉴 추가하기
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                )}

                {/* 메뉴 추가 모달 */}
                {showModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                <h3 className="text-xl font-bold text-slate-800">새 메뉴 추가</h3>
                                <button
                                    onClick={closeModal}
                                    className="text-slate-400 hover:text-slate-500"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="space-y-5">
                                    <div>
                                        <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                                            <FaImage className="mr-2 text-blue-500" />
                                            메뉴 이미지
                                        </label>
                                        <input
                                            name="menu_image"
                                            onChange={handleInputImageChange}
                                            type="file"
                                            accept="image/*"
                                            className="w-full px-4 py-2.5 text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 file:text-blue-600 hover:file:bg-blue-100 border border-slate-300 rounded-lg"
                                        />
                                    </div>

                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">카테고리</label>
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => setMenuData({ ...menuData, menu_category: 1 })}
                                                className={`flex-1 px-4 py-2.5 rounded-lg font-medium ${menuData.menu_category === 1
                                                    ? 'bg-orange-600 text-white'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                            >
                                                <FaUtensils className="inline-block mr-2" />
                                                요리
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setMenuData({ ...menuData, menu_category: 2 })}
                                                className={`flex-1 px-4 py-2.5 rounded-lg font-medium ${menuData.menu_category === 2
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                            >
                                                <FaCoffee className="inline-block mr-2" />
                                                음료
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setMenuData({ ...menuData, menu_category: 3 })}
                                                className={`flex-1 px-4 py-2.5 rounded-lg font-medium ${menuData.menu_category === 3
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                            >
                                                <FaClipboardList className="inline-block mr-2" />
                                                주문
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                                            <FaUtensils className="mr-2 text-slate-500" />
                                            메뉴 이름
                                        </label>
                                        <input
                                            type="text"
                                            name="menu_name"
                                            value={menu_name}
                                            onChange={handleInputChange}
                                            placeholder="메뉴 이름을 입력하세요"
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                                            <FaMoneyBillWave className="mr-2 text-green-500" />
                                            가격 (원)
                                        </label>
                                        <input
                                            type="number"
                                            name="menu_price"
                                            value={menu_price}
                                            onChange={handleInputChange}
                                            placeholder="가격을 입력하세요"
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                                            <FaAlignLeft className="mr-2 text-purple-500" />
                                            메뉴 설명
                                        </label>
                                        <textarea
                                            name="menu_description"
                                            value={menu_description}
                                            onChange={handleInputChange}
                                            placeholder="메뉴에 대한 설명을 입력하세요"
                                            rows="3"
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end gap-3 p-6 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={closeModal}
                                    className="px-5 py-2.5 bg-slate-200 text-slate-800 font-medium rounded-lg hover:bg-slate-300"
                                >
                                    취소
                                </button>
                                <button
                                    type="button"
                                    onClick={handleSubmit}
                                    className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                                >
                                    저장하기
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* 메뉴 수정 모달 */}
                {showEditModal && (
                    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                        <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full overflow-hidden">
                            <div className="flex items-center justify-between p-6 border-b border-slate-200">
                                <h3 className="text-xl font-bold text-slate-800">메뉴 수정</h3>
                                <button
                                    onClick={closeEditModal}
                                    className="text-slate-400 hover:text-slate-500"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                                    </svg>
                                </button>
                            </div>

                            <div className="p-6">
                                <div className="mb-6">
                                    {photoToAddPreview()}
                                </div>

                                <div className="space-y-5">
                                    <div>
                                        <label className="block text-sm font-medium text-slate-700 mb-2">카테고리</label>
                                        <div className="flex space-x-2">
                                            <button
                                                type="button"
                                                onClick={() => setMenuEditData({ ...menuEditData, edit_category: 1 })}
                                                className={`flex-1 px-4 py-2.5 rounded-lg font-medium ${edit_category === 1
                                                    ? 'bg-orange-600 text-white'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                            >
                                                <FaUtensils className="inline-block mr-2" />
                                                요리
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setMenuEditData({ ...menuEditData, edit_category: 2 })}
                                                className={`flex-1 px-4 py-2.5 rounded-lg font-medium ${edit_category === 2
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                            >
                                                <FaCoffee className="inline-block mr-2" />
                                                음료
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => setMenuEditData({ ...menuEditData, edit_category: 3 })}
                                                className={`flex-1 px-4 py-2.5 rounded-lg font-medium ${edit_category === 3
                                                    ? 'bg-green-600 text-white'
                                                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'}`}
                                            >
                                                <FaClipboardList className="inline-block mr-2" />
                                                주문
                                            </button>
                                        </div>
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                                            <FaUtensils className="mr-2 text-slate-500" />
                                            메뉴 이름
                                        </label>
                                        <input
                                            type="text"
                                            name="edit_name"
                                            value={edit_name}
                                            onChange={handleEditInputChange}
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                                            <FaMoneyBillWave className="mr-2 text-green-500" />
                                            가격 (원)
                                        </label>
                                        <input
                                            type="number"
                                            name="edit_price"
                                            value={edit_price}
                                            onChange={handleEditInputChange}
                                            onWheel={numberInputOnWheelPreventChange}
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        />
                                    </div>

                                    <div>
                                        <label className="flex items-center text-sm font-medium text-slate-700 mb-2">
                                            <FaAlignLeft className="mr-2 text-purple-500" />
                                            메뉴 설명
                                        </label>
                                        <textarea
                                            name="edit_description"
                                            value={edit_description}
                                            onChange={handleEditInputChange}
                                            rows="3"
                                            className="w-full px-4 py-2.5 rounded-lg border border-slate-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                                        ></textarea>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-between p-6 border-t border-slate-200">
                                <button
                                    type="button"
                                    onClick={deleteItem}
                                    className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700"
                                >
                                    <FaTrash className="inline-block mr-2" />
                                    삭제하기
                                </button>

                                <div className="flex gap-3">
                                    <button
                                        type="button"
                                        onClick={closeEditModal}
                                        className="px-5 py-2.5 bg-slate-200 text-slate-800 font-medium rounded-lg hover:bg-slate-300"
                                    >
                                        취소
                                    </button>
                                    <button
                                        type="button"
                                        onClick={handleEditSubmit}
                                        className="px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700"
                                    >
                                        <FaSave className="inline-block mr-2" />
                                        저장하기
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </Manage>
    );
}
