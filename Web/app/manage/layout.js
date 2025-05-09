"use client"

import ManageNavBar from "@/components/feature/manage_navbar";
import ManageSideBar from "@/components/feature/manage_sidebar";

export default function ManageLayout({ children }) {
    return (
        <div className="flex flex-row min-h-screen bg-[#f9fafb]">
            <ManageSideBar />
            <div className="w-full md:ml-64">
                <ManageNavBar />
                {children}
            </div>
        </div>
    );
}