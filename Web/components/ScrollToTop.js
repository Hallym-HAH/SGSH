'use client'; // 클라이언트 컴포넌트 선언

import { useEffect } from "react";
import { usePathname } from "next/navigation"; // App Router에서는 next/navigation 사용

export default function ScrollToTop() {
    const pathname = usePathname(); // 현재 경로 가져오기

    useEffect(() => {
        // 페이지가 변경될 때마다 스크롤을 맨 위로 이동
        window.scroll(0, 0);
    }, [pathname]); // pathname이 변경될 때마다 실행

    return null; // 아무것도 렌더링하지 않음
}
