'use client'

import ManageDashboard from "@/components/feature/manage_dashboard";
import { usePathname } from "next/navigation";


export default function Manage({ children }) {
    const pathname = usePathname();
    return (
        <>
            <div className="flex flex-row min-h-screen bg-[#f5f6ff]">
                <div className="w-full">
                    {pathname == ("/manage") ?
                        <ManageDashboard />
                        : null}
                    {children}
                </div>
            </div>
        </>
    );
}