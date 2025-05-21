import Image from "next/image";
import Link from 'next/link'

export default function Home() {
  return (
    <div className="font-sans">
      {/* 헤더 섹션 */}
      <div className="bg-gradient-to-r from-indigo-600 to-violet-500 text-white">
        <div className="container mx-auto px-4 py-20 max-w-6xl">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 md:pr-12">
              <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mb-4">
                매출은 올리고<br />업무는 줄이는<br /><span className="text-yellow-300">가치가게</span>
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90">
                하나의 앱으로 가게의 모든 것을 관리하세요.<br />메뉴부터 예약, 주문, 매출까지,<br />사장님의 시간을 되찾아 드립니다.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/contact">
                  <button className="px-8 py-4 bg-white text-indigo-700 rounded-lg text-lg font-bold hover:bg-yellow-300 transition duration-300 shadow-xl transform hover:scale-105">
                    지금 시작하기
                  </button>
                </Link>
                {/* <button className="px-8 py-4 bg-transparent border-2 border-white rounded-lg text-lg font-bold hover:bg-white hover:text-indigo-700 transition duration-300">
                  데모 영상 보기
                </button> */}
              </div>
              <p className="mt-4 text-sm font-medium bg-indigo-800 inline-block px-3 py-1 rounded-full">
                ✨ 신규 가입 시 3개월 무료
              </p>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <div className="relative">
                <div className="absolute -top-6 -left-6 w-[500px] h-[385px] bg-gradient-to-r from-indigo-900 to-violet-800 rounded-2xl transform rotate-3"></div>
                <Image
                  className="relative rounded-xl shadow-xl w-[500px] h-[385px] object-cover"
                  width={600}
                  height={400}
                  src={"/images/main_1.png"}
                  alt={"대시보드 화면"}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 서비스 소개 섹션 */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-semibold text-sm tracking-wider uppercase">
              왜 가치가게인가요?
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              모든 기능을 하나로, <span className="text-indigo-600">하나의 앱</span>에서
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
              복잡한 가게 운영, 이제 하나의 앱으로 간편하게 관리하세요.<br />점주님의 소중한 시간을 되찾아 드립니다.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">메뉴 & 정보 관리</h3>
              <p className="text-gray-600">
                메뉴 가격, 설명, 이미지를 쉽게<br />업데이트하고 실시간으로 반영해보세요.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">예약 & 주문 관리</h3>
              <p className="text-gray-600">
                복잡한 예약과 주문을 한눈에 확인하고<br />효율적으로 처리하세요.
              </p>
            </div>

            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 transform hover:-translate-y-2">
              <div className="w-14 h-14 bg-indigo-100 rounded-full flex items-center justify-center mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-3">매출 분석 & 통계</h3>
              <p className="text-gray-600">
                데이터 기반으로 비즈니스 인사이트를 얻고<br />성장 전략을 수립하세요.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 특징 섹션 */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          {/* 키오스크 기능 */}
          <div className="flex flex-col md:flex-row items-center mb-20">
            <div className="md:w-1/2 md:pr-12">
              <span className="text-indigo-600 font-semibold text-sm tracking-wider uppercase">
                키오스크 기능
              </span>
              <h2 className="text-3xl font-bold mt-2">
                태블릿만 있으면<br />키오스크 완성
              </h2>
              <p className="mt-4 text-gray-600 text-lg">
                별도의 장비 없이 태블릿으로 키오스크를 운영하세요.<br />
                초기 설치 비용 절감과 함께 통합 관리의 편리함을 경험하세요.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  태블릿 기반 키오스크 시스템
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  실시간 메뉴 업데이트
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  다양한 결제 시스템 연동
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <Image
                className="rounded-xl shadow-xl w-[500px] h-[385px] object-cover"
                width={500}
                height={400}
                src={"/images/main_2.png"}
                alt={"키오스크 화면"}
              />
            </div>
          </div>

          {/* 매출 관리 섹션 */}
          <div className="flex flex-col-reverse md:flex-row items-center mb-20">
            <div className="md:w-1/2 mt-12 md:mt-0">
              <Image
                className="rounded-xl shadow-xl w-[500px] h-[385px] object-cover"
                width={500}
                height={400}
                src={"/images/main_3.png"}
                alt={"매출 대시보드 화면"}
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <span className="text-indigo-600 font-semibold text-sm tracking-wider uppercase">
                매출 관리 시스템
              </span>
              <h2 className="text-3xl font-bold mt-2">
                데이터로 보는<br />점포 성장 스토리
              </h2>
              <p className="mt-4 text-gray-600 text-lg">
                매출 데이터를 직관적인 그래프로 분석하고 경영 인사이트를 얻으세요.<br />
                다양한 매출 패턴을 파악해 효과적인 전략을 수립하세요.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  실시간 매출 현황 대시보드
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  매출 예측 및 인사이트 제공
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  최적 판매 전략 추천
                </li>
              </ul>
            </div>
          </div>

          {/* 예약 관리 섹션 */}
          <div className="flex flex-col md:flex-row items-center mb-20">
            <div className="md:w-1/2 md:pr-12">
              <span className="text-indigo-600 font-semibold text-sm tracking-wider uppercase">
                예약 관리 시스템
              </span>
              <h2 className="text-3xl font-bold mt-2">
                복잡한 예약도<br />간편하게 관리
              </h2>
              <p className="mt-4 text-gray-600 text-lg">
                예약부터 노쇼 방지까지 모든 과정을 자동화하세요.<br />
                고객 정보와 예약 내역을 확인하고 효율적으로 테이블을 관리하세요.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  맞춤형 예약 페이지 제공
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  자동 알림 및 예약 확인 기능
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  고객 데이터 및 방문 이력 관리
                </li>
              </ul>
            </div>
            <div className="md:w-1/2 mt-12 md:mt-0">
              <Image
                className="rounded-xl shadow-xl w-[500px] h-[385px] object-cover"
                width={500}
                height={400}
                src={"/images/main_4.png"}
                alt={"예약 관리 화면"}
              />
            </div>
          </div>

          {/* AI 홍보 지원 */}
          <div className="flex flex-col-reverse md:flex-row items-center">
            <div className="md:w-1/2 mt-12 md:mt-0">
              <Image
                className="rounded-xl shadow-xl w-[500px] h-[385px] object-cover"
                width={500}
                height={400}
                src={"/images/main_5.png"}
                alt={"AI 홍보글 생성 화면"}
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <span className="text-indigo-600 font-semibold text-sm tracking-wider uppercase">
                AI 홍보 지원
              </span>
              <h2 className="text-3xl font-bold mt-2">
                SNS 홍보글을<br />AI가 자동으로
              </h2>
              <p className="mt-4 text-gray-600 text-lg">
                버튼 한 번으로 매력적인 SNS 홍보글과 해시태그를 생성합니다.<br />
                마케팅에 들이는 시간을 줄이고 고객 응대에 집중하세요.
              </p>
              <ul className="mt-6 space-y-2">
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  AI 기반 홍보글 자동 생성
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  트렌딩 해시태그 추천
                </li>
                <li className="flex items-center">
                  <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  예약 페이지 직접 연결
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>


      {/* 가격 정책 */}
      <div className="py-20 bg-gray-50">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-semibold text-sm tracking-wider uppercase">
              합리적인 가격
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              비용 걱정 없이 시작하세요
            </h2>
            <p className="mt-4 text-gray-600 max-w-2xl mx-auto text-lg">
              초기 비용이 부담스러우셨나요? 가치가게는 합리적인 월 구독료로 모든 기능을 제공합니다.
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-xl p-8 max-w-2xl mx-auto transform hover:scale-105 transition duration-300">
            <div className="flex justify-between items-center border-b pb-8">
              <div>
                <h3 className="text-2xl font-bold">올인원 플랜</h3>
                <p className="text-gray-600 mt-1">모든 기능 무제한 사용</p>
              </div>
              <div className="text-right">
                <span className="text-3xl font-bold text-indigo-600">29,000원</span>
                <span className="text-gray-500">/월</span>
                <p className="text-indigo-600 font-medium">지금 가입 시 3개월 무료</p>
              </div>
            </div>

            <ul className="mt-8 space-y-4">
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>가게 정보 및 메뉴 관리</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>예약 & 주문 통합 관리</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>매출 분석 및 통계 리포트</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>AI 자동 홍보글 생성 (월 30회)</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>키오스크 기능 무제한 사용</span>
              </li>
              <li className="flex items-start">
                <svg className="h-6 w-6 text-green-500 mr-2 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                </svg>
                <span>플랫폼 앱 정보 자동 연동</span>
              </li>
            </ul>

            <div className="mt-10">
              <Link href="/contact">
                <button className="w-full py-4 bg-indigo-600 text-white rounded-lg text-lg font-bold hover:bg-indigo-700 transition duration-300">
                  무료로 시작하기
                </button>
              </Link>
              <p className="text-center text-sm text-gray-500 mt-4">언제든지 해지 가능, 약정 없음</p>
            </div>
          </div>
        </div>
      </div>

      {/* 테스티모니얼 */}
      <div className="py-20 bg-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-indigo-600 font-semibold text-sm tracking-wider uppercase">
              고객 후기
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-2">
              실제 사용 중인 점주님들의 이야기
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-indigo-600 font-bold">K</span>
                </div>
                <div>
                  <h4 className="font-bold">안봉근 점주님</h4>
                  <p className="text-gray-500 text-sm">서울 카페</p>
                </div>
              </div>
              <p className="text-gray-600">
                "예약과 주문을 따로 관리하느라 정신이 없었는데, 가치가게를 사용하면서 시간이 절반으로 줄었어요. 매출 분석 기능은 정말 신세계였습니다."
              </p>
              <div className="mt-4 flex">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-indigo-600 font-bold">P</span>
                </div>
                <div>
                  <h4 className="font-bold">한서연 점주님</h4>
                  <p className="text-gray-500 text-sm">부산 레스토랑</p>
                </div>
              </div>
              <p className="text-gray-600">
                "SNS 마케팅에 시간을 너무 많이 쏟았는데, AI 홍보글 기능이 정말 혁명적이에요. 메뉴 사진만 등록하면 알아서 홍보글을 만들어주니 편합니다."
              </p>
              <div className="mt-4 flex">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-xl">
              <div className="flex items-center mb-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mr-4">
                  <span className="text-indigo-600 font-bold">L</span>
                </div>
                <div>
                  <h4 className="font-bold">황휘근 점주님</h4>
                  <p className="text-gray-500 text-sm">대구 베이커리</p>
                </div>
              </div>
              <p className="text-gray-600">
                "키오스크 구매 비용이 부담스러웠는데, 가치가게로 태블릿만으로 키오스크를 운영하니 초기 비용을 크게 절약했습니다. 메뉴 변경도 실시간으로 반영돼요."
              </p>
              <div className="mt-4 flex">
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                <svg className="w-5 h-5 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA 섹션 */}
      <div className="py-20 bg-indigo-600 text-white">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold">
            이제 가게 운영에 집중하세요
          </h2>
          <p className="mt-6 text-xl opacity-90 max-w-2xl mx-auto">
            하루 평균 2시간을 절약해주는 가치가게와 함께<br />
            더 많은 고객, 더 높은 매출, 더 나은 비즈니스를 경험하세요.
          </p>
          <div className="mt-10">
            <Link href="/contact">
              <button className="px-8 py-4 bg-white text-indigo-600 rounded-lg text-lg font-bold hover:bg-yellow-300 transition duration-300 shadow-xl mr-4">
                무료로 시작하기
              </button>
            </Link>
            {/* <button className="px-8 py-4 bg-transparent border-2 border-white rounded-lg text-lg font-bold hover:bg-white hover:text-indigo-600 transition duration-300">
              데모 신청하기
            </button> */}
          </div>
        </div>
      </div>

      {/* 푸터 */}
      <div className="py-10 bg-gray-900 text-white">
        <div className="container mx-auto px-4 max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-xl font-bold mb-4">가치가게</h3>
              <p className="text-gray-400">
                점주님의 시간을 아끼고<br />비즈니스를 성장시키는<br />통합 관리 솔루션
              </p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">연락처</h3>
              <p className="text-gray-400">팀 HAH, 강원특별자치도 춘천시 한림대학길 1</p>
              <p className="text-gray-400">사업자번호: 000-00-000000</p>
              <p className="text-gray-400">통신판매업 신고번호 2025-강원춘천-0000호</p>
              <p className="text-gray-400">제휴문의: 010-0000-0000</p>
            </div>
            <div>
              <h3 className="text-xl font-bold mb-4">바로가기</h3>
              <ul className="space-y-2 text-gray-400">
                <li><a href="#" className="hover:text-white transition duration-300">서비스 소개</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">요금 안내</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">고객 지원</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">개인정보처리방침</a></li>
                <li><a href="#" className="hover:text-white transition duration-300">이용약관</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-12 pt-8 border-t border-gray-800 text-center text-gray-500">
            <p>© 2025 가치가게 All rights reserved.</p>
          </div>
        </div>
      </div>

    </div>
  );
}
