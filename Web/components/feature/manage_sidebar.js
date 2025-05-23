import Link from 'next/link';
import Image from 'next/image'
import { usePathname } from "next/navigation";

export default function ManageSideBar() {
    const pathname = usePathname();

    const isActive = (path) => pathname === path;

    return (
        <aside id="default-sidebar" className="fixed w-64 h-screen transition-transform -translate-x-full md:translate-x-0 bg-white shadow-sm border-r border-slate-100" aria-label="Sidebar">
            <div className="h-full flex flex-col py-6">
                {/* 로고 영역 */}
                <div className="px-6 mb-8">
                    <div className="flex items-center gap-2">
                        <Image
                            src={'/images/icon1.png'}
                            alt="가치가게 로고"
                            width={36}
                            height={36}
                            className="rounded-lg w-[30px]"
                        />
                        <span className="font-bold text-[27px] text-slate-800">가치가게</span>
                    </div>
                </div>

                {/* 메뉴 영역 */}
                <div className="px-3 flex-1 overflow-y-auto">
                    <ul className="space-y-2">
                        <li>
                            <Link href="/manage" className={`flex items-center px-4 py-3 rounded-lg transition-all ${isActive("/manage")
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "text-slate-600 hover:bg-slate-50"}`}>
                                <svg className={`w-5 h-5 ${isActive("/manage") ? "text-blue-600" : "text-slate-400"}`} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    {/* 대시보드 아이콘 */}
                                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z"></path>
                                </svg>
                                <span className="ml-3">대시보드</span>
                            </Link>
                        </li>

                        <li>
                            <Link href="/manage/info" className={`flex items-center px-4 py-3 rounded-lg transition-all ${isActive("/manage/info")
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "text-slate-600 hover:bg-slate-50"}`}>
                                <svg className={`w-5 h-5 ${isActive("/manage/info") ? "text-blue-600" : "text-slate-400"}`} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    {/* 가게 정보 아이콘 */}
                                    <path fillRule="evenodd" d="M4 4a2 2 0 012-2h8a2 2 0 012 2v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4zm3 1h6v4H7V5zm8 8v2h1v-2h-1zm-2-6H7v2h6V7zm0 4H7v2h6v-2z" clipRule="evenodd"></path>
                                </svg>
                                <span className="ml-3">가게 정보</span>
                            </Link>
                        </li>

                        <li>
                            <Link href="/manage/menu" className={`flex items-center px-4 py-3 rounded-lg transition-all ${isActive("/manage/menu")
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "text-slate-600 hover:bg-slate-50"}`}>
                                <svg className={`w-5 h-5 ${isActive("/manage/menu") ? "text-blue-600" : "text-slate-400"}`} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    {/* 메뉴 관리 아이콘 */}
                                    <path d="M3 3a1 1 0 000 2h11a1 1 0 100-2H3zM3 7a1 1 0 000 2h5a1 1 0 000-2H3zM3 11a1 1 0 100 2h4a1 1 0 100-2H3zM13 16a1 1 0 102 0v-5.586l1.293 1.293a1 1 0 001.414-1.414l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 101.414 1.414L13 10.414V16z"></path>
                                </svg>
                                <span className="ml-3 flex-1">메뉴 관리</span>
                                {/* <span className="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">Pro</span> */}
                            </Link>
                        </li>

                        <li>
                            <Link href="/manage/order" className={`flex items-center px-4 py-3 rounded-lg transition-all ${isActive("/manage/order")
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "text-slate-600 hover:bg-slate-50"}`}>
                                <svg className={`w-5 h-5 ${isActive("/manage/order") ? "text-blue-600" : "text-slate-400"}`} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    {/* 주문 관리 아이콘 */}
                                    <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"></path>
                                </svg>
                                <span className="ml-3 flex-1">주문 관리</span>
                                {/* <span className="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">Pro</span> */}
                            </Link>
                        </li>

                        <li>
                            <Link href="/manage/reserve" className={`flex items-center px-4 py-3 rounded-lg transition-all ${isActive("/manage/reserve")
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "text-slate-600 hover:bg-slate-50"}`}>
                                <svg className={`w-5 h-5 ${isActive("/manage/reserve") ? "text-blue-600" : "text-slate-400"}`} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    {/* 예약 관리 아이콘 */}
                                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd"></path>
                                </svg>
                                <span className="ml-3 flex-1">예약 관리</span>
                                {/* <span className="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">Pro</span> */}
                            </Link>
                        </li>

                        <li>
                            <Link href="/manage/sales" className={`flex items-center px-4 py-3 rounded-lg transition-all ${isActive("/manage/sales")
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "text-slate-600 hover:bg-slate-50"}`}>
                                <svg className={`w-5 h-5 ${isActive("/manage/sales") ? "text-blue-600" : "text-slate-400"}`} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    {/* 매출 관리 아이콘 */}
                                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 0l-2 2a1 1 0 101.414 1.414L8 10.414l1.293 1.293a1 1 0 001.414 0l4-4z" clipRule="evenodd"></path>
                                </svg>
                                <span className="ml-3">매출 관리</span>
                            </Link>
                        </li>

                        <li>
                            <Link href="/manage/post" className={`flex items-center px-4 py-3 rounded-lg transition-all ${isActive("/manage/post")
                                ? "bg-blue-50 text-blue-600 font-medium"
                                : "text-slate-600 hover:bg-slate-50"}`}>
                                <svg className={`w-5 h-5 ${isActive("/manage/post") ? "text-blue-600" : "text-slate-400"}`} viewBox="0 0 20 20" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    {/* 홍보글 생성 아이콘 */}
                                    <path fillRule="evenodd" d="M12.586 4.586a2 2 0 112.828 2.828l-3 3a2 2 0 01-2.828 0 1 1 0 00-1.414 1.414 4 4 0 005.656 0l3-3a4 4 0 00-5.656-5.656l-1.5 1.5a1 1 0 101.414 1.414l1.5-1.5zm-5 5a2 2 0 012.828 0 1 1 0 101.414-1.414 4 4 0 00-5.656 0l-3 3a4 4 0 105.656 5.656l1.5-1.5a1 1 0 10-1.414-1.414l-1.5 1.5a2 2 0 11-2.828-2.828l3-3z" clipRule="evenodd"></path>
                                </svg>
                                <span className="ml-3 flex-1">홍보글 생성</span>
                                <span className="px-2 py-0.5 text-xs font-medium text-blue-600 bg-blue-100 rounded-full">Pro</span>
                            </Link>
                        </li>
                    </ul>
                </div>

                {/* 하단 영역 - 선택적 */}
                <div className="mt-6 px-6 pt-4 border-t border-slate-100">
                    <div className="flex items-center text-sm text-slate-500">
                        <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                        <span>가치가게 관리자</span>
                    </div>
                </div>
            </div>
        </aside>
    )
}
