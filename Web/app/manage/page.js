'use client'

import ManageInfo from "@/components/feature/manage_info";
import { usePathname } from "next/navigation";

export default function Manage({ children }) {
    const pathname = usePathname();
    return (
        <>
            <div className="flex flex-row min-h-screen bg-[#f9fafb]">
                <div className="w-full">
                    {pathname == ("/manage") ?
                        <ManageInfo />
                        : null}
                    {children}
                </div>
            </div>
        </>
    );
}