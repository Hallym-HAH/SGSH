'use client'

import ManageDashboard from "@/components/feature/manage_dashboard";
import { usePathname } from "next/navigation";

export default function Manage({ children }) {
    const pathname = usePathname();

    // 조건 배열
    const managePaths = [
        "/manage/info",
        "/manage/menu",
        "/manage/order",
        "/manage/reserve",
        "/manage/sales",
        "/manage/post"
    ];

    // 해당 문자열로 시작하면 true
    const isManagePath = managePaths.some(path => pathname.startsWith(path));

    // /manage 또는 /manage/ 인지 체크
    const isManageRoot = pathname === "/manage" || pathname === "/manage/";

    return (
        <div className="flex flex-row min-h-screen bg-[#f5f6ff]">
            <div className="w-full">
                {isManageRoot
                    ? <ManageDashboard />
                    : isManagePath
                        ? children
                        : null}
            </div>
        </div>
    );
}
