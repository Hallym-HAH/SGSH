// src/app/api/search-blogs/route.js
import { NextResponse } from 'next/server';

export async function GET(request) {
  try {
    // URL에서 검색어 추출
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    if (!query) {
      return NextResponse.json({ error: '검색어가 필요합니다' }, { status: 400 });
    }

    // 네이버 API 키
    const clientId = process.env.NAVER_API_ID;
    const clientSecret = process.env.NAVER_API_SECRET;

    if (!clientId || !clientSecret) {
      console.error('네이버 API 키가 설정되지 않았습니다');
      return NextResponse.json({ error: 'API 설정 오류' }, { status: 500 });
    }

    // 네이버 API 호출
    const response = await fetch(
      `https://openapi.naver.com/v1/search/blog.json?query=${encodeURIComponent(query)}&display=5`,
      {
        headers: {
          'X-Naver-Client-Id': clientId,
          'X-Naver-Client-Secret': clientSecret
        }
      }
    );

    if (!response.ok) {
      throw new Error(`네이버 API 오류: ${response.status}`);
    }

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    console.error('검색 오류:', error);
    return NextResponse.json(
      { error: '블로그 검색 중 오류가 발생했습니다' },
      { status: 500 }
    );
  }
}
